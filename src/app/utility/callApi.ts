export async function sendCheckoutRequest(inputValue: string | null) {
    try {
        const response = await fetch('/api/checkout', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputValue }),
        });

        return response.status;
    } catch (error: any) {
        throw new Error("退勤の際にエラーが発生しました");
    }
 }