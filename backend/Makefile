.PHONY: dev run build clean

# 開発サーバー（ホットリロード）
dev:
	air

# 通常実行
run:
	go run main.go

# ビルド
build:
	go build -o leaving-work-api

# クリーンアップ
clean:
	rm -rf tmp/
	rm -f leaving-work-api
	rm -f *.log