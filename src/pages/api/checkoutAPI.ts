import { ErrorHandler } from "../../app/utility/ErrorHandler";

export default async function checkoutAPI(inputValue: string | null): Promise<any> {
  try {
    // Promise型の値を返すfetchにおいては非同期処理が必須となる
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputValue }),
    });

    return response.status;
  } catch (error: any) {
      ErrorHandler.handleError(error, null);
      return;
  }
}
