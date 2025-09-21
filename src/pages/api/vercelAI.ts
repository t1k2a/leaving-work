import { NextApiRequest, NextApiResponse } from 'next';

import { generateText } from 'ai';

const ultraFastMessages = [
  "**お疲れ様！** 🌟",
  "**今日もGood Job！** ✨", 
  "**頑張りました！** 😊",
  "**ナイスワーク！** 💪",
  "**今日も最高！** 🙏"
];

export interface VercelAIResponse {
  text: string;
  timestamp: string;
  error?: string;
  fallbackMessage?: string;
}

async function vercelAImain(prompt?: string): Promise<string> {
  const quickPrompts = [
    "疲れた人への優しい一言。年上男性の穏やかな労りで。",
    "仕事終わりの癒しの言葉。疲れた人に友達風でゆるく寄り添う癒しの言葉を。", 
  ];

  const instruction = "を一言で答えて";

  const selectedPrompt = prompt || quickPrompts[Math.floor(Math.random() * quickPrompts.length)];

  const commonPrompts = "。10-30文字、日本語、改行OK。「はい、承知しました。」等の挨拶は不要。文字数も表示させないで";

  // 内部でAIのAPI_KEYを参照している
  const { text } = await generateText({
    model: 'openai/gpt-5',
    prompt: selectedPrompt + instruction + commonPrompts,
  });

  if (!text || typeof text !== 'string') {
    throw new Error('Invalid response from Vercel AI (Google)');
  }

  return String(text).trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const useFake = process.env.E2E_FAKE_LLM === '1' || process.env.NODE_ENV === 'test';
    if (useFake) {
      return res.status(200).json({
        text: "**E2E用ダミーメッセージ** 🌟",
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

    const text = await vercelAImain();
        
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
