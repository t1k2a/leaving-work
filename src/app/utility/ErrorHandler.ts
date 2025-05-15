// エラーの詳細を出力させる共通クラス
// ログファイルを作成する際はこのクラスを修正する形で使いたい
export class ErrorHandler {
   static handleError(error: unknown, res?: any|null|undefined): void {
      if (error instanceof Error) {
         console.error("Error message:", error.message)

         // ファイル名と行数の取得
         const stackLines: string[] = error.stack?.split("\n") || [];

         if (stackLines.length > 1) {
            console.error("Error occured at:", stackLines[1].trim());
         }

         // スタックトレース全体の表示
         console.error("Stack trace:");
         console.error(error.stack);
      } else {
         console.error("Unknown error:", error)
      }

      if (res) {
         const responseBody = {
            message: 'サーバー内部でエラーが発生しました。'
         };
         res.status(500).send(responseBody);
      }
   }
}