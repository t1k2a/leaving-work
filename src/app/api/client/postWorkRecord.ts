import { isDev } from '@/app/utility/checkEnvironment'

function formattedDateTimeForJST(clockOutTime: string): string {
    // ISO形式の日時をJSTに変換
    const date: Date = new Date(clockOutTime);
    const jstDate: Date = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC+9

    return jstDate.toISOString();
}

function setBaseURL(): string | undefined {
    let baseURL: string = '';

    if (isDev()) {
        baseURL = process.env.NEXT_PUBLIC_LEAVING_WORK_API_URL_DEV ?? '';
    } else {
        baseURL = process.env.NEXT_PUBLIC_LEAVING_WORK_API_URL_PROD ?? '';
    }

    if (!baseURL) {
        console.warn('API URLが未設定のため送信スキップ')
        return; // 例外エラーを出さずに静かに終える
    }

    return baseURL;
}

export const postWorkRecord = async (
    userId: string,
    clockOutTime: string,
): Promise<void> => {
    const jstTimeString = formattedDateTimeForJST(clockOutTime);
    const baseURL = setBaseURL();
    if (!baseURL) {
        // ベースURL未設定時は安全に終了（UIはブロックしない）
        return;
    }
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

    console.log('退勤の記録が完了しました');
}
