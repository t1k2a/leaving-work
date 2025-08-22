package model

type WorkRecord struct {
	ID int `json:"id" gorm:"primaryKey"`
	UserID string `json:"user_id"`
	ClockOutTime string `json:"clock_out_time"`
}

func (WorkRecord) TableName() string {
	return "work_records"
}