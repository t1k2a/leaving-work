import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

// 既存のキャッシュ + 並列処理
let kv: any;
try {
  kv = require('@vercel/kv').kv
} catch (error) {
 // ローカル環境用のフォールバック
 console.log('Vercel KV not available, using in-memory cache');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

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
  cached?: boolean;
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
      const cached = await kv.get(key);
      
      if (cached) {
        console.log('Vercel KV cache hit');
      }

      return cached;
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
      await kv.setex(key, CACHE_DURATION, value.trim());
      console.log('Saved to Vercel KV');
    } catch (error) {
      console.error('Failed to save to Vercel KV:', error);
      throw error;
    }
  }
}

async function geminiAPImain(prompt?: string) {
  // 1日の終わりを想定したプロンプト
  const endOfDayPrompts = [
    "一日を終えたあなたへ。今日はどんなことがあったんだろう。うまくいったことも、ちょっとしんどかったことも、全部よくがんばったよね。今はもう、何もしなくていい時間。言葉で静かに寄り添ってあげて。励まさなくていい、前を向かせなくていい。ただ、やさしく包むような言葉を届けて。まるで膝枕をしてくれる人が、頭を撫でながら囁くよう",
    "一日を終えて疲れている人に向けて、年上の男性がやさしく語りかけるような労りのメッセージを作成してください。励ましや前向きな言葉ではなく、ただそっと寄り添い、許し、安心感を与える内容にしてください。語り口は穏やかで包容力があり、肩の力が抜けるような文章にしてください。改行を使ってリズムよく、読み手がふっと力を抜けるような空気感を意識して",
    "一日頑張って疲れている人に向けて、気の置けない友達がゆるく寄り添うような癒しのメッセージを作成してください。励ましたり前を向かせたりする内容は避けてください。言葉選びは砕けすぎず、でも親しみがあり、そっと横にいてくれるような安心感を出してください。少し砕けた口調で、読んだ人がふっと笑ったり、気を抜けたりするような雰囲気を大切にして"
  ];

  const selectedPrompt = prompt || endOfDayPrompts[Math.floor(Math.random() * endOfDayPrompts.length)];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: selectedPrompt + "、出力は日本語で10文字以上20文字以内の文章としてください。挨拶・定型句・導入文は不要です。本題の言葉のみを出力してください",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });

  return response.text;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const startTime = Date.now();

  try {
    // 並列戦略で最速レスポンスを取得
    const { text, source } = await getMessageWithFallback();
    const responseTime = Date.now() - startTime;
    
    // 新しいメッセージをバックグラウンドでキャッシュ更新
    if (source === 'cache' || source === 'ultrafast') {
      // 非同期でキャッシュ更新（レスポンスは待たない）
      updateCacheInBackground().catch(err => 
        console.error('Background update failed:', err)
      );
    } else if (source === 'gemini' && text && text.trim()) {
      // Geminiからの新しいレスポンスをキャッシュ（nullチェック付き）
      try {
        await setCache(CACHE_KEY, text);
      } catch (error) {
        console.error('Failed to cache Gemini response:', error);
      }
    }
    
    console.log(`✅ Response in ${responseTime}ms from ${source}`);
    
    return res.status(200).json({ 
      text,
      timestamp: new Date().toISOString(),
      cached: source === 'cache',
      source,
      responseTime
    });

  } catch (error: any) {
    console.error('All strategies failed:', error);
    
    return res.status(200).json({
      text: "**今日もお疲れ様でした！** 🌟",
      timestamp: new Date().toISOString(),
      fallback: true,
      source: 'emergency'
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
