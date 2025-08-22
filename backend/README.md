**Leaving Work API（Backend）**

このディレクトリは、退勤記録の作成・参照を行うGo製APIサーバーのソースです。Next.jsフロントエンド（リポジトリ直下）から呼び出されます。

**目的**
- ユーザーの退勤時刻（clock_out_time）を登録・取得する。
- 既存フロントエンドと疎結合に保ち、将来的な拡張（別クライアントやモバイルアプリ）に備える。

**技術スタック**
- 言語/ランタイム: Go 1.24
- Web: chi + CORS
- DB: PostgreSQL（GORM）
- マイグレーション: golang-migrate（SQLファイル）

---

## セットアップ

環境変数は`backend/.env`に定義します（必要に応じて上書き）。

必須（デフォルトは`db/db.go`のfallbackも参照）
- `DB_HOST`（例: `localhost`）
- `DB_PORT`（例: `5432`）
- `DB_USER`（例: `postgres`）
- `DB_PASSWORD`（例: `password`）
- `DB_NAME`（例: `leaving_work`）

CORS（許可するフロントエンドURL）
- `LEAVING_WORK_URL_DEV`
- `LEAVING_WORK_URL_STG`
- `LEAVING_WORK_URL_PROD`

### 1. DBを起動

DockerでPostgreSQLを立ち上げます。

```bash
docker compose -f backend/docker-compose.yml up -d db
# 5432が競合する場合: POSTGRES_PORT=5433 docker compose -f backend/docker-compose.yml up -d db
```

### 2. マイグレーションを適用（up）

Docker（推奨）
```bash
# Composeのネットワークに接続し、サービス名dbで到達
docker run --rm \
  -v "$PWD/backend/db/migrations":/migrations \
  --network backend_default \
  migrate/migrate -path=/migrations \
  -database "postgres://postgres:password@db:${POSTGRES_PORT:-5432}/leaving_work?sslmode=disable" up
```

ローカルCLIがある場合
```bash
migrate -path "/home/joji/leaving-work/backend/db/migrations" \
  -database "postgres://postgres:password@localhost:${DB_PORT:-5432}/leaving_work?sslmode=disable" up
```

### 3. APIサーバーを起動

ローカル（ホットリロード）
```bash
cd backend
# air が必要: https://github.com/air-verse/air
make dev
```

通常実行 / ビルド
```bash
cd backend
make run   # go run main.go（:8080で待受け）
make build # ./leaving-work-api を生成
```

Docker実行
```bash
cd backend
docker build -t leaving-work-api .
docker run --rm -p 8080:8080 --env-file .env --network host leaving-work-api
```

---

## API仕様

ベースURL: `http://localhost:8080`

### GET /work_records
- 概要: 指定ユーザーの退勤記録一覧を返す
- クエリ: `user_id`（必須, 英数字）
- レスポンス: 200 OK、JSON配列
```json
[
  { "id": 1, "user_id": "sample123", "clock_out_time": "2024-07-01T18:30:00Z" }
]
```
- エラー:
  - 400 Bad Request: `Invalid or  missing user_id (required, alphanum)`（バリデーションエラー）

例:
```bash
curl "http://localhost:8080/work_records?user_id=sample123"
```

### POST /work_records
- 概要: 退勤記録を1件作成
- ボディ（JSON）:
```json
{ "user_id": "sample123", "clock_out_time": "2025-08-22T18:30:00+09:00" }
```
- バリデーション:
  - `user_id`: 必須・英数字
  - `clock_out_time`: 必須・ISO8601/RFC3339（タイムゾーン必須）
- レスポンス:
  - 201 Created: 作成したレコードを返す
  - 400 Bad Request: `Validation failed` or `User not registered`
  - 500 Internal Server Error: `Failed to create work record`

例:
```bash
curl -X POST http://localhost:8080/work_records \
  -H "Content-Type: application/json" \
  -d '{"user_id":"sample123","clock_out_time":"2025-08-22T18:30:00+09:00"}'
```

注意: ユーザー存在チェックを行います。`users`テーブルに対象ユーザーが無い場合は`User not registered`で400を返します。

---

## データベース

テーブル
- `users(id PRIMARY KEY, name NOT NULL)`
- `work_records(id SERIAL PRIMARY KEY, user_id VARCHAR NOT NULL, clock_out_time TIMESTAMP NOT NULL)`

初期データ
- `work_records`にサンプル挿入マイグレーションあり
- `users`は空です。動作確認にはユーザーを追加してください:
```sql
INSERT INTO users (id, name) VALUES ('sample123', 'Sample User');
```

---

## 開発メモ

- CORS許可リストは`.env`の`LEAVING_WORK_URL_*`で設定。未設定時は`http://localhost:3000`を許可。
- サーバーポートは`:8080`固定。
- Goモジュール名は`leaving-work-api`。
- Makefileターゲット: `dev`（air）、`run`、`build`、`clean`。

---

## マイグレーションの作成

ファイル名はタイムスタンプ＋名前で2ファイル（up/down）を作成します。

Dockerを使う例
```bash
docker run --rm -v "$PWD/backend/db/migrations":/migrations -u $(id -u):$(id -g) \
  migrate/migrate create -dir /migrations -ext sql -format "20060102150405" add_feature
```

例で生成されるファイル
- `YYYYMMDDHHMMSS_add_feature.up.sql`
- `YYYYMMDDHHMMSS_add_feature.down.sql`

---

## ライセンス

このバックエンドのライセンスはリポジトリルートのポリシーに従います。

---

このREADMEは本プロジェクトに特化した情報を提供するために更新されています。運用や仕様変更に合わせて適宜メンテナンスしてください。
