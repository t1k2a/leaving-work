import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export default async (req: any, res: any) => {
  try {
    const now = new Date();
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const formatted = dayjs(now).tz("Asia/Tokyo").format("HH:mm");
    let text = `${formatted}:退勤しました！`;
    const prependText = req.body.text;

    if (prependText) {
      text = text + "\n追加テキスト：\n" + prependText;
    }

    await axios.post(
      "https://api.line.me/v2/bot/message/push",
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

    await axios.post(
      "https://aebc-2404-7a81-2061-a00-8ff-df18-5809-6830.ngrok-free.app/api",
      { text: `${text}` },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.send("退勤に成功しました");
  } catch (error: any) {
    console.log(error.response.data);
    res.status(500).send("退勤する際にアプリケーションエラーが発生しました");
  }
};
