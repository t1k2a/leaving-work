import axios from "axios";

export default async (req: any, res: any) => {
  try {
    const now = new Date();
    const formatted = now.toLocaleTimeString("ja-JP");
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
