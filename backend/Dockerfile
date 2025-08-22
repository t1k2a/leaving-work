# ベースイメージ
FROM golang:1.24.3-alpine

# 作業ディレクトリを作成
WORKDIR /app

# go.mod, go.sum を先にコピーして依存解決
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# 残りのソースコードをコピー
COPY . .

# アプリをビルド
RUN go build -o main .

# コンテナ起動時に実行されるコマンド
CMD ["./main"]
