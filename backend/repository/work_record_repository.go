package repository

import (
	"leaving-work-api/model"
	"leaving-work-api/db"
)

type WorkRecordRepository interface {
	FindByUserID(userID string) []model.WorkRecord
	UserExists(userID string) bool
	CreateWorkRecord(userID, clockOutTime string) (*model.WorkRecord, error)
}

type workRecordRepository  struct{}

func NewWorkRecordRepository() WorkRecordRepository {
	return &workRecordRepository{}
}

func (r *workRecordRepository) FindByUserID(userID string) ([]model.WorkRecord, error) {
	var records []model.WorkRecord
	if err := db.DB.Where("user_id = ?", userID).Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

// ユーザー存在チェック
func (r *workRecordRepository) UserExists(userID string) (bool, error) {
	var count int64
	result := db.DB.Model(&model.User{}).Where("id = ?", userID).Count(&count)
	if result.Error != nil {
		// エラーログを出力
		log.Printf("UserExists DB error: %v", result.Error)
		return false, result.Error
	}

	println("UserExists: userID =", userID, ", count =", count)
	return count > 0, nil
}

// 退勤記録を保存
func (r *workRecordRepository) CreateWorkRecord(userID, clockOutTime string) (*model.WorkRecord, error) {
	record := &model.WorkRecord{
		UserID: userID,
		ClockOutTime: clockOutTime,
	}

	println("CreateWorkRecord: Creating record for userID =", userID, ", clockOutTime =", clockOutTime)

	// 直接SQLを実行して
	if err := db.DB.Create(record).Error; err != nil {
		log.Printf("CreateWorkRecord DB error:", err.Error())
		return nil, err
	}
	println("CreateWorkRecord: Successfully created record with ID =", record.ID)

	return record, nil
}