import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// @ts-ignore
import HomePlayer from "google-home-player";

// 初期設定
const googleHome = new HomePlayer(process.env.IP, "ja");

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
    googleHome.say("退勤しました");

    res.send("退勤に成功しました");
  } catch (error: any) {
    console.log(error.response.data);
    res.status(500).send("退勤する際にアプリケーションエラーが発生しました");
  }
};
