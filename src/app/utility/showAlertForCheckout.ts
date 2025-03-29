
export default function (responseStatus: number, openModal?: () => void) {    
    if (responseStatus === 200) {
        // オプショナルチェイニング opemModalが関数として定義されている場合にのみ、openModal()を実行する
        openModal?.()
        alert('退勤が記録されました');
    } else {
        alert('退勤の際にエラーが発生したため、送信を取り消します');
    }
}