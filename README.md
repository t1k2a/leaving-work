# Leaving Work

このプロジェクトは、LINE チャットに退勤メッセージを送信するためのシンプルなインターフェースを提供します。ログイン後にボタンをタップするだけで、`HH:mm:退勤しました！` といったメッセージを送信できます。また、任意で追加テキストをメッセージに含めたり、画面上で AI による励ましの言葉を表示したりすることも可能です。

## セットアップ

1. 依存関係をインストールします。
   ```bash
   npm install
   ```
2. プロジェクトのルートに `.env.local` を作成し、下記の環境変数を定義します。
3. 開発サーバーを起動します。
   ```bash
   npm run dev
   ```
   アプリケーションは [http://localhost:3000](http://localhost:3000) で利用できます。

## 環境変数

| 名前 | 説明 |
| ---- | ---- |
| `NEXT_PUBLIC_NAME1` | 最初のユーザーを表すラジオボタンの表示名 |
| `NEXT_PUBLIC_NAME2` | 2 番目のユーザーを表すラジオボタンの表示名 |
| `AUTH_PASSWORD` | NextAuth の認証で使用するパスワード |
| `GEMINI_API_KEY` | AI による励ましメッセージを生成するための Google Generative AI API キー |
| `LINE_MESSAGE_PUSH_URL` | LINE Messaging API の Push メッセージ送信エンドポイント |
| `LINE_ACCESS_TOKEN_DEV` | 開発環境で使用するチャネルアクセストークン |
| `ACCOUNT_ID_DEV` | 開発環境でメッセージを受信するユーザーまたはグループ ID |
| `LINE_ACCESS_TOKEN_STG` | ステージング環境で使用するチャネルアクセストークン |
| `ACCOUNT_ID_STG` | ステージング環境でメッセージを受信するユーザーまたはグループ ID |
| `LINE_ACCESS_TOKEN` | 本番環境で使用するチャネルアクセストークン |
| `GROUP_TO` | 本番環境でメッセージを受信するグループ ID |
| `CHANNEL_SECRET` | LINE Webhook の検証に用いるチャネルシークレット |

