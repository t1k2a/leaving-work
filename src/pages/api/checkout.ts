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

    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: process.env.ACCOUNT_ID,
        messages: [
          {
            type: "text",
            text: `${formatted}:退勤しました！`,
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
    console.log(error.response.data);
    res.status(500).send("退勤する際にアプリケーションエラーが発生しました");
  }
};
