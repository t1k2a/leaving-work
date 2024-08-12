import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ErrorHandler } from '../../app/utility/ErrorHandler'

export default async (req: any, res: any) => {
  const now = new Date();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const formatted = dayjs(now).tz("Asia/Tokyo").format("HH:mm");
  let text = `${formatted}:退勤しました！`;
  try {
    const prependText = req.body.text;
    if (prependText) {
      text = text + "\n追加テキスト：\n" + prependText;
    }
    await axios.post(
      "https://api.line.me/v2/bot/message/psh",
      {
        to: process.env.ACCOUNT_ID,
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
          Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
        },
      }
    );
  res.send("退勤に成功しました");
  } catch (error: any) {
    ErrorHandler.handleError(error, res)
    return;
  }

  //TODO 下記処理は別ファイルに書き出したい
  try {
    await axios.post(
      `${process.env.NGROK_URL}`,
      text,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    ErrorHandler.handleError(error, res)
  }
};
