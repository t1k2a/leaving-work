import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ErrorHandler } from "../../app/utility/ErrorHandler";
import { NextApiRequest, NextApiResponse } from "next";

interface CheckoutRequestBody {
  userName?: string;
  text?: string;
}

interface LineApiSuccessResponse {
  status: number;
  data: LinePushApiResponse[];
}

interface LinePushApiResponse {
  sentMessages: LineSentMessageInfo[];
}


interface LineSentMessageInfo {
  id: string;
  quoteToken: string;
}

interface LineTextMessage {
  type: "text";
  text: string;
}


interface LinePushPayload {
  to: string | undefined;
  messages: LineTextMessage[];
}

function formattedNow(): string {
  const now = new Date();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return dayjs(now).tz("Asia/Tokyo").format("HH:mm");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body as CheckoutRequestBody;
  const userName = requestBody.userName;
  const prependText = requestBody.text;
  const isDev: boolean = process.env.NODE_ENV === 'development';
  const isStaging: boolean = process.env.VERCEL_ENV === 'preview';
  let lineAccessToken = '';
  let messageTO = '';
  const lineMessagePushUrl: string =  process.env.LINE_MESSAGE_PUSH_URL ?? ''

  if (isDev) {
    lineAccessToken = process.env.LINE_ACCESS_TOKEN_DEV ?? '';
    messageTO = process.env.ACCOUNT_ID_DEV ?? '';
  } else if (isStaging) {
    lineAccessToken = process.env.LINE_ACCESS_TOKEN_STG ?? '';
    messageTO = process.env.ACCOUNT_ID_STG ?? '';
  } else {
    lineAccessToken = process.env.LINE_ACCESS_TOKEN ?? '';
    messageTO = process.env.GROUP_TO ?? ''
  }

  if (!messageTO) {
    return res.status(500).json({ error:  "LINEメッセージの宛先が設定されていません"})
  }
  if (!lineAccessToken) {
    return res.status(500).json({ error: "LINEアクセストークンが設定されていません" })
  }
  if (!lineMessagePushUrl) {
    return res.status(500).json({ error: "LINEメッセージプッシュURLが設定されていません"})
  }

  let text: string = '';
  
  if (userName) {
    text = `${userName}が、`
  }

  text = text + `${formattedNow()}:退勤しました！`;

  if (prependText) {
    text = text + "\n追加テキスト：\n" + prependText;
  }

  const linePayload: LinePushPayload = {
    to: messageTO,
    messages: [
      {
        type: "text",
        text: text,
      },
    ],
  };

  try {
    const lineResponse: AxiosResponse<LineApiSuccessResponse> = await axios.post(
      lineMessagePushUrl,
      linePayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineAccessToken}`,
        },
      }
    );

    // 現状ステータスしか使用していないが、汎用性を求めてdataも返す
    return res.status(lineResponse.status).json(lineResponse.data);
  } catch (error: any) {
    ErrorHandler.handleError(error, res);
    return;
  }

};
