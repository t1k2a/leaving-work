// エラーの詳細を出力させる共通クラス
export class ErrorHandler {
   static handleError(error: unknown, res: any|null|undefined): void {
      if (error instanceof Error) {
         console.error("Error message:", error.message)

         // ファイル名と行数の取得
         const stackLines = error.stack?.split("\n") || [];

         if (stackLines.length > 1) {
            console.error("Error occured at:", stackLines[1].trim());
         }

         // スタックトレース全体の表示
         console.error("Stack trace:");
         console.error(error.stack);
      } else {
         console.error("Unknown error:", error)
      }

      if (res !== undefined) {
         res.status(500).send(error);
      }
   }
}