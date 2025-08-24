package repository

import (
    "leaving-work-api/model"
    "leaving-work-api/db"
    "log"
    "time"
)

type WorkRecordRepository interface {
    FindByUserID(userID string) []model.WorkRecord
    UserExists(userID string) bool
    CreateWorkRecord(userID string, clockOutTime time.Time) (*model.WorkRecord, error)
}

type workRecordRepository  struct{}

func NewWorkRecordRepository() WorkRecordRepository {
	return &workRecordRepository{}
}

func (r *workRecordRepository) FindByUserID(userID string) []model.WorkRecord {
    var records []model.WorkRecord
    if err := db.DB.Where("user_id = ?", userID).Find(&records).Error; err != nil {
        log.Printf("FindByUserID DB error: %v", err)
        return []model.WorkRecord{}
    }
    return records
}

// ユーザー存在チェック
func (r *workRecordRepository) UserExists(userID string) bool {
    var count int64
    result := db.DB.Model(&model.User{}).Where("id = ?", userID).Count(&count)
    if result.Error != nil {
        // エラーログを出力
        log.Printf("UserExists DB error: %v", result.Error)
        return false
    }

    log.Printf("UserExists: userID=%s, count=%d", userID, count)
    return count > 0
}

// 退勤記録を保存
func (r *workRecordRepository) CreateWorkRecord(userID string, clockOutTime time.Time) (*model.WorkRecord, error) {
    record := &model.WorkRecord{
        UserID: userID,
        ClockOutTime: clockOutTime,
    }

    log.Printf("CreateWorkRecord: Creating record for userID=%s, clockOutTime=%v", userID, clockOutTime)

	// 直接SQLを実行して
	if err := db.DB.Create(record).Error; err != nil {
        log.Printf("CreateWorkRecord DB error: %v", err)
        return nil, err
    }
    log.Printf("CreateWorkRecord: Successfully created record with ID=%d", record.ID)

	return record, nil
}
