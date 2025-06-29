import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 環境判定付きキャッシュ
let kv: any;
try {
  kv = require('@vercel/kv').kv;
} catch (error) {
  console.log('Vercel KV not available');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CACHE_KEY = 'gemini_daily_message';
const CACHE_DURATION = 600; // 10分間

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

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const response = await Promise.race([
    model.generateContent(selectedPrompt),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    )
  ]) as any;

  // 安全な文字列取得とnullチェック
  const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Invalid response from Gemini API');
  }
  
  return text.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const freshMessage = await generateFreshMessage();
    
    if (!freshMessage || !freshMessage.trim()) {
      throw new Error('Generated message is empty');
    }
    
    if (kv) {
      await kv.setex(CACHE_KEY, CACHE_DURATION, freshMessage);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Cache warmed successfully'
    });

  } catch (error: any) {
    console.error('Cache warming failed:', error);
    
    return res.status(500).json({ 
      error: 'Cache warming failed'
    });
  }
} 