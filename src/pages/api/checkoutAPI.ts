async function checkoutAPI(inputValue: string | null): Promise<any> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: inputValue }),
  });

  if (!response.ok) {
    throw new Error("退勤の際にエラーが発生したため、送信を取り消します");
  }

  return response.json();
}

export default checkoutAPI;
