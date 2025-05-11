import { ErrorHandler } from "../../app/utility/ErrorHandler";

export default async function checkoutAPI(inputValue: string | null): Promise<number | undefined> {
  try {
    // Promise型の値を返すfetchにおいては非同期処理が必須となる
    const response: Response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputValue }),
    });

    return response.status;
  } catch (error: unknown) {
      ErrorHandler.handleError(error, null);
  }
}
