export async function sendCheckoutRequest(inputValue: string | null, userName: string | null): Promise<number> {
    try {
        const response = await fetch('/api/checkout', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputValue, userName: userName }),
        });

        return response.status;
    } catch (error: unknown) {
        throw new Error("退勤の際にエラーが発生しました");
    }
 }