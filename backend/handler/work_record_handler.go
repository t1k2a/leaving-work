package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"log"
	"leaving-work-api/model"
	"leaving-work-api/service"
)

type WorkRecordHandler struct {
	service service.WorkRecordService
	validator *validator.Validate
}

func NewWorkRecordHandler(s service.WorkRecordService) *WorkRecordHandler {
	return &WorkRecordHandler{
		service: s,
		validator: validator.New(),
	}
}

func (h *WorkRecordHandler) GetWorkRecords(w http.ResponseWriter, r *http.Request) {
	query := model.WorkRecordQuery {
		UserID: r.URL.Query().Get("user_id"),
	}
	
	// バリデーション実行
	if err := h.validator.Struct(query); err != nil {
		http.Error(w, "Invalid or  missing user_id (required, alphanum)", http.StatusBadRequest)
		return
	}

	records := h.service.GetRecordsByUserID(query.UserID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(records)
}

func (h *WorkRecordHandler) CreateWorkRecord(w http.ResponseWriter, r *http.Request) {
	var req model.CreateWorkRecordRequest

	// jsonを構造体にデコード
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("JSON decode error: %v", err)
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}
	
	log.Printf("Received request: UserID=%s, ClockOutTime=%s", req.UserID, req.ClockOutTime)

	// バリデーション
	if err := h.validator.Struct(req); err != nil {
		log.Printf("Validation error: %v", err)
		http.Error(w, "Validation failed", http.StatusBadRequest)
		return
	}

	if !h.service.UserExists(req.UserID) {
		http.Error(w, "User not registered", http.StatusBadRequest)
		return
	}

	// 保存処理
	record, err := h.service.CreateWorkRecord(req.UserID, req.ClockOutTime)
	if err != nil {
		log.Printf("CreateWorkRecord error: %v", err)
		http.Error(w, "Failed to create work record", http.StatusInternalServerError)
		return
	}

	// 成功レスポンス
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(record)
}