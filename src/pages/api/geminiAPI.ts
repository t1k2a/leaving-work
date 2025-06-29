import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VercelKV } from '@vercel/kv';

// 既存のキャッシュ + 並列処理
let kv: VercelKV | undefined;
try {
  kv = require('@vercel/kv').kv
} catch (error) {
 // ローカル環境用のフォールバック
 console.log('Vercel KV not available, using in-memory cache');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ultraFastMessages = [
  "**お疲れ様！** 🌟",
  "**今日もGood Job！** ✨", 
  "**頑張りました！** 😊",
  "**ナイスワーク！** 💪",
  "**今日も最高！** 🙏"
];

// 並列戦略: 複数の取得方法を同時実行
async function getMessageWithFallback(): Promise<{ text: string; source: string }> {
  const promises = [
    // 戦略1: キャッシュから取得
    getCache(CACHE_KEY).then(cached => 
      cached && typeof cached === 'string' && cached.trim() 
        ? { text: cached, source: 'cache' } 
        : null
    ),
    
    // 戦略2: Gemini API（1.5秒でタイムアウト）
    Promise.race([
      geminiAPImain().then(text => 
        text && typeof text === 'string' && text.trim()
          ? { text, source: 'gemini' } 
          : null
      ),
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Gemini timeout')), 1500)
      )
    ]).catch(() => null),
    
    // 戦略3: 超高速フォールバック（即座に実行）
    new Promise<{ text: string; source: string }>(resolve => 
      setTimeout(() => resolve({
        text: ultraFastMessages[Math.floor(Math.random() * ultraFastMessages.length)],
        source: 'ultrafast'
      }), 800) // 0.8秒後にフォールバック準備
    )
  ];

  // 最初に成功したものを返す
  const results = await Promise.allSettled(promises);
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value && result.value.text) {
      return result.value;
    }
  }

  // 全て失敗した場合の最終フォールバック
  return {
    text: "**今日もお疲れ様でした！** 🌟",
    source: 'emergency'
  };
}

export interface GeminiResponse {
  text: string;
  timestamp: string;
  error?: string;
  fallbackMessage?: string;
  cached: boolean;
}

// ローカル用インメモリキャッシュ
const localCache = new Map<string, { data: string; timestamp: number}>();
const CACHE_KEY = 'gemini_daily_message';
const CACHE_DURATION = 600; // 10分間（秒）

// 環境に応じたキャッシュ取得
async function getCache(key: string): Promise<string | null> {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // ローカル： インメモリキャッシュ
    const cached = localCache.get(key);

    if (cached && (Date.now() - cached.timestamp) < (CACHE_DURATION * 1000)) {
      console.log('Local cache hit');
      return cached.data;
    }

    return null;
  } else {
    // 本番: Vercel KV
    try {
      const cached = await kv?.get(key);

      return typeof cached === 'string' && cached.trim() ? cached : null;
    } catch(error: any) {
      console.error('Vercel KV error:', error);
      return null;
    }
  }
}

// 環境に応じたキャッシュ保存
async function setCache(key: string, value: string): Promise<void> {
  // 値の検証
  if (!value || typeof value !== 'string' || !value.trim()) {
    throw new Error('Invalid cache value');
  }

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // ローカル: インメモリキャッシュ
    localCache.set(key, {
      data: value.trim(),
      timestamp: Date.now()
    });
    console.log('Saved to local cache');
  } else {
    // 本番: Vercel KV
    try {
      await kv?.setex(key, CACHE_DURATION, value.trim());
      console.log('Saved to Vercel KV');
    } catch (error) {
      console.error('Failed to save to Vercel KV:', error);
      throw error;
    }
  }
}

async function geminiAPImain(prompt?: string): Promise<string> {
  const departureStation = process.env.DEPARTURE_STATION || "新宿駅";
  const arrivalStation = process.env.ARRIVAL_STATION || "渋谷駅";
  
  // 短縮版プロンプト（レスポンス速度重視）
  const quickPrompts = [
    "今日の労い一言を20文字以内で",
    "仕事終了の達成感を15文字で表現",
    `${departureStation}→${arrivalStation}のルート概要を25文字で`,
    "帰宅時のアドバイスを20文字で",
    "明日への励ましを15文字で"
  ];

  const selectedPrompt = prompt || quickPrompts[Math.floor(Math.random() * quickPrompts.length)];

  // 修正: genAI.getGenerativeModelを使用
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // タイムアウト付きでGemini API呼び出し
  const response = await Promise.race([
    model.generateContent(selectedPrompt),
    // 3秒でタイムアウト
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 3000)
    )
  ]) as any;

  // 安全な文字列取得
  const text = response?.response?.text() || response?.text;
  
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid response from Gemini API');
  }
  
  return text.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 並列戦略で最速レスポンスを取得
    const { text, source } = await getMessageWithFallback();
    
    // バックグラウンド更新処理は残す
    if (source === 'cache' || source === 'ultrafast') {
      updateCacheInBackground().catch(err => 
        console.error('Background update failed:', err)
      );
    } else if (source === 'gemini' && text && text.trim()) {
      try {
        await setCache(CACHE_KEY, text);
      } catch (error) {
        console.error('Failed to cache Gemini response:', error);
      }
    }
        
    return res.status(200).json({ 
      text,
      timestamp: new Date().toISOString(),
      cached: source === 'cache'
    });

  } catch (error: any) {
    console.error('Message generation failed:', error);
    
    return res.status(200).json({
      text: "**今日もお疲れ様でした！** 🌟",
      timestamp: new Date().toISOString(),
      cached: false
    });
  }
}

// バックグラウンドキャッシュ更新
async function updateCacheInBackground() {
  try {
    const freshMessage = await geminiAPImain();
    
    // nullチェックを追加
    if (freshMessage && typeof freshMessage === 'string' && freshMessage.trim()) {
      await setCache(CACHE_KEY, freshMessage);
      console.log('🔄 Background cache update completed');
    } else {
      console.log('🔄 Background cache update skipped - invalid message');
    }
  } catch (error) {
    console.log('🔄 Background cache update failed:', error);
  }
}
