// AIコーディングによって生成されたファイル

import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
// LINE SDKなどを利用すると署名検証や型定義が楽になります
// import * as line from '@line/bot-sdk';

const CHANNEL_SECRET = process.env.CHANNEL_SECRET || ''; // 環境変数からチャネルシークレットを取得

// LINEからのリクエストボディを検証する関数
const validateSignature = (body: string, signature: string | string[] | undefined): boolean => {
  if (!signature || typeof signature !== 'string') {
    return false;
  }
  const hash = crypto
    .createHmac('sha256', CHANNEL_SECRET)
    .update(body) // ここではBufferではなく生の文字列ボディが必要なことに注意
    .digest('base64');
  return signature === hash;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // LINE WebhookではPOSTリクエストのみを受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // リクエストボディを取得 (Next.jsでは通常パース済みだが、署名検証のために生のボディが必要な場合がある)
  // bodyParserの設定によっては生のボディを取得する工夫が必要になることがあります
  // 参考: https://nextjs.org/docs/api-routes/api-middlewares#custom-config
  const rawBody = await getRawBody(req); // 生のボディを取得するヘルパー関数が必要
  const bodyString = rawBody.toString('utf-8');

  // 署名を検証
  const signature = req.headers['x-line-signature'];
  if (!validateSignature(bodyString, signature)) {
    console.error('Invalid signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const body = JSON.parse(bodyString);
    const events = body.events; // パースされたJSONボディ

    // 複数のイベントが一度に来る可能性があるためループ処理
    for (const event of events) {
      console.log('Received event:', event);

      // イベントタイプに応じた処理
      if (event.type === 'message' && event.source.type === 'group') {
        const groupId = event.source.groupId;
        const userId = event.source.userId; // メッセージを送ったユーザーのID (取得できない場合もある)
        const messageText = event.message.type === 'text' ? event.message.text : 'Unsupported message type';

        console.log(`Message from group ${groupId} by user ${userId}: ${messageText}`);

        // ここでグループIDをデータベースに保存したり、
        // 特定のメッセージに反応して返信したりする処理を実装
        // 例: 返信する場合 (別途LINE SDKやaxiosで実装)
        // await replyToLine(event.replyToken, `グループ[${groupId}]からのメッセージ「${messageText}」を受け取りました！`);

      } else if (event.type === 'join' && event.source.type === 'group') {
        const groupId = event.source.groupId;
        console.log(`Bot joined group: ${groupId}`);
        // ボットがグループに参加したときの処理（例: グループIDを記録）
      }
      // 他のイベントタイプ（follow, unfollow, leaveなど）も必要に応じて処理
    }

    // LINEプラットフォームへ正常に受信したことを伝える
    res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('Error processing webhook event:', error);
    // エラーが発生した場合でもLINEプラットフォームには200 OKを返すことが推奨される場合がある
    // (エラーを返すとリトライが繰り返されるため)
    // ただし、状況に応じて適切なステータスコードを返す
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 生のリクエストボディを取得するヘルパー関数の例 (要調整)
async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Next.jsのbodyParserを無効にして生のボディを読み取れるようにする設定
// (pages/api/line-webhook.ts ファイルの先頭、または関数外に記述)
export const config = {
  api: {
    bodyParser: false, // bodyParserを無効化
  },
};
