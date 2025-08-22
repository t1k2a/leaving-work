package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5" // ルーティングライブラリ
	"leaving-work-api/handler"
	"leaving-work-api/repository"
	"leaving-work-api/service"
	"leaving-work-api/db"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// .envファイルを読み込み
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	db.Init()
	r := chi.NewRouter()

	// 環境変数からCORS許可URLを構築
	allowedOrigins := []string{}
	if devURL := os.Getenv("LEAVING_WORK_URL_DEV"); devURL != "" {
		allowedOrigins = append(allowedOrigins, devURL)
	}
	if stgURL := os.Getenv("LEAVING_WORK_URL_STG"); stgURL != "" {
		allowedOrigins = append(allowedOrigins, stgURL)
	}
	if prodURL := os.Getenv("LEAVING_WORK_URL_PROD"); prodURL != "" {
		allowedOrigins = append(allowedOrigins, prodURL)
	}
	
	// 環境変数が設定されていない場合のデフォルト値
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"http://localhost:3000"}
	}

	log.Printf("CORS Allowed Origins: %v", allowedOrigins)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	// DI(依存注入)
	repo := repository.NewWorkRecordRepository()
	svc := service.NewWorkRecordService(repo)
	h := handler.NewWorkRecordHandler(svc)

	r.Get("/work_records", h.GetWorkRecords)
	r.Post("/work_records", h.CreateWorkRecord)
	
	log.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}