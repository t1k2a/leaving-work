import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

// 環境判定付きキャッシュ
let kv: any;
try {
  kv = require('@vercel/kv').kv;
} catch (error) {
  console.log('Vercel KV not available');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const CACHE_KEY = 'gemini_daily_message';
const CACHE_DURATION = 3600; // 1時間

// 定期実行用のメッセージ生成
async function generateFreshMessage(): Promise<string> {
  const departureStation = process.env.DEPARTURE_STATION || "新宿駅";
  const arrivalStation = process.env.ARRIVAL_STATION || "渋谷駅";
  
  const prompts = [
    "今日の労い一言を20文字以内で",
    "仕事終了の達成感を15文字で表現",
    `${departureStation}→${arrivalStation}のルート概要を25文字で`,
    "帰宅時のアドバイスを20文字で",
    "明日への励ましを15文字で"
  ];

  const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: selectedPrompt,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    }
  });

  // 安全な文字列取得とnullチェック
  const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Invalid response from Gemini API');
  }
  
  return text.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Cron Job認証（セキュリティ）
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Warming cache...');
    
    // 新しいメッセージを生成
    const freshMessage = await generateFreshMessage();
    
    // メッセージの有効性を再確認
    if (!freshMessage || !freshMessage.trim()) {
      throw new Error('Generated message is empty');
    }
    
    // キャッシュに保存
    if (kv) {
      await kv.setex(CACHE_KEY, CACHE_DURATION, freshMessage);
      console.log('✅ Cache warmed with fresh message');
    } else {
      console.log('⚠️ Vercel KV not available, skipping cache update');
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Cache warmed successfully',
      preview: freshMessage.substring(0, 50) + (freshMessage.length > 50 ? '...' : ''),
      messageLength: freshMessage.length
    });

  } catch (error: any) {
    console.error('❌ Cache warming failed:', error);
    return res.status(500).json({ 
      error: 'Cache warming failed',
      details: error.message 
    });
  }
} 