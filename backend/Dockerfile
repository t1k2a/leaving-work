# ビルドステージ
FROM golang:1.24.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# 静的リンクされたバイナリを生成
RUN CGO_ENABLED=0 go build -o /main .

# 実行ステージ
FROM alpine:latest

WORKDIR /app

# ビルドステージからバイナリのみをコピー
COPY --from=builder /main .

# コンテナ起動時に実行されるコマンド
CMD ["./main"]