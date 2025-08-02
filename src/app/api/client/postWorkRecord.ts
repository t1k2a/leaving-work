export const postWorkRecord = async (
    userId: string,
    clockOutTime: string,
): Promise<void> => {
    const res = await fetch("http://localhost:8080/work_records", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: userId,
            clock_out_time: clockOutTime,
        })
    })

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`退勤登録に失敗しました: ${errorText}`)
    }
}