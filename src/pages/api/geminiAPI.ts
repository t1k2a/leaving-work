import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ultraFastMessages = [
  "**お疲れ様！** 🌟",
  "**今日もGood Job！** ✨", 
  "**頑張りました！** 😊",
  "**ナイスワーク！** 💪",
  "**今日も最高！** 🙏"
];

export interface GeminiResponse {
  text: string;
  timestamp: string;
  error?: string;
  fallbackMessage?: string;
}

async function geminiAPImain(prompt?: string): Promise<string> {
  const quickPrompts = [
    "疲れた人への優しい一言。年上男性の穏やかな労りで。",
    "仕事終わりの癒しの言葉。疲れた人に友達風でゆるく寄り添う癒しの言葉を。",
  ];

  const instruction = "を一言で答えて";

  const selectedPrompt = prompt || quickPrompts[Math.floor(Math.random() * quickPrompts.length)];
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const commonPrompts = "。10-30文字、日本語、改行OK。「はい、承知しました。」等の挨拶は不要。文字数も表示させないで";

  const response = await model.generateContent(selectedPrompt + instruction + commonPrompts);

  // 安全な文字列取得
  const text = response?.response?.text();
  
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
    const station = typeof req.query.station === 'string' ? req.query.station : undefined;
    const arrivalTime = typeof req.query.arrivalTime === 'string' ? req.query.arrivalTime : undefined;

    const prompt = station && arrivalTime
      ? `疲れた人への優しい一言。勤務先から${station}まで${arrivalTime}に到着します`
      : undefined;

    const text = await geminiAPImain(prompt);
        
    return res.status(200).json({ 
      text,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Message generation failed:', error);
    
    // タイムアウトまたはエラー時はフォールバックメッセージ
    const fallbackMessage = ultraFastMessages[Math.floor(Math.random() * ultraFastMessages.length)];
    
    return res.status(200).json({
      text: fallbackMessage,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}
