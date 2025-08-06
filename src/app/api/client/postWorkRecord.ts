function formattedDateTimeForJST(clockOutTime: string): string {
    // ISO形式の日時をJSTに変換
    const date: Date = new Date(clockOutTime);
    const jstDate: Date = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC+9

    return jstDate.toISOString();
}

function setBaseURL(): string {
    const isDev: boolean = process.env.NODE_ENV === 'development';
    let baseURL: string = '';

    if (isDev) {
        baseURL = process.env.NEXT_PUBLIC_LEAVING_WORK_API_URL_DEV ?? '';
    } else {
        baseURL = process.env.NEXT_PUBLIC_LEAVING_WORK_API_URL_PROD ?? '';
    }

    if (!baseURL) {
        throw new Error('API URLが設定されていません')
    }

    return baseURL;
}

export const postWorkRecord = async (
    userId: string,
    clockOutTime: string,
): Promise<void> => {
    const jstTimeString = formattedDateTimeForJST(clockOutTime);
    const baseURL = setBaseURL();
    const res = await fetch(`${baseURL}/work_records`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: userId,
            clock_out_time: jstTimeString,
        })
    })

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`退勤登録に失敗しました: ${errorText}`)
    }
}