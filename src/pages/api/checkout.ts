import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ErrorHandler } from "../../app/utility/ErrorHandler";

export default async (req: any, res: any) => {
  const now = new Date();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const formatted = dayjs(now).tz("Asia/Tokyo").format("HH:mm");
  const userName = req.body.userName;
  const isDev = process.env.NODE_ENV === 'development';
  const config = {
    lineMessagePushUrl : process.env.LINE_MESSAGE_PUSH_URL ?? '',
    lineAccessToken : isDev ? process.env.LINE_ACCESS_TOKEN_DEV : process.env.LINE_ACCESS_TOKEN,
    messageTO : isDev ? process.env.ACCOUNT_ID_DEV : process.env.GROUP_TO
  }

  let text = '';
  
  if (userName) {
    text = `${userName}が、`
  }

  text = text + `${formatted}:退勤しました！`;
  
  try {
    const prependText = req.body.text;
    if (prependText) {
      text = text + "\n追加テキスト：\n" + prependText;
    }

    const lineResponse = await axios.post(
      config.lineMessagePushUrl,
      {
        to: config.messageTO,
        messages: [
          {
            type: "text",
            text: text,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.lineAccessToken}`,
        },
      }
    );

    // 現状ステータスしか使用していないが、汎用性を求めてdataも返す
    return res.status(lineResponse.status).json(lineResponse.data);
  } catch (error: any) {
    ErrorHandler.handleError(error, res);
    return;
  }

  //TODO 下記処理は別ファイルに書き出したい
  // ngrokの使用用途をまとめて実装方針を決める（削除も視野）
  // try {
  //   await axios.post(`${process.env.NGROK_URL}`, text, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // } catch (error: any) {
  //   ErrorHandler.handleError(error, res);
  // }
};
