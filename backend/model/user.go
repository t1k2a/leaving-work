package model

type User struct {
	ID string `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

func (User) TableName() string {
	return "users"
}