package service 

import (
	"leaving-work-api/model"
	"leaving-work-api/repository"
)

type WorkRecordService interface {
	GetRecordsByUserID(userID string) []model.WorkRecord
	UserExists(userID string) bool
	CreateWorkRecord(userId, clockOutTime string) (*model.WorkRecord, error)
}

type workRecordService struct {
	repo repository.WorkRecordRepository
}

// コンストラクタ関数
// 新しいインスタンスを作成して返す
// .. 通常の関数として呼び出さす service := NewWorkRecordService(repo)
// 初期化処理を行う役割
// 「作る」ための関数
func NewWorkRecordService(repo repository.WorkRecordRepository) WorkRecordService {
	return &workRecordService{repo}
}

// レシーバメソッド
// 既存のインスタンスに対して操作を行う
// レシーバ（s *workRecordService）を通じて呼び出す：records := 
//   service.GetRecordsByUSerID("123")
//  インスタンスの持つデータにアクセスできる（この例では s.repo）
// 「使う」ための関数
func (s *workRecordService) GetRecordsByUserID(userID string) []model.WorkRecord {
	return s.repo.FindByUserID(userID)
}

func (s *workRecordService) UserExists(userID string) bool {
	return s.repo.UserExists(userID)
}

func (s *workRecordService) CreateWorkRecord(userId, clockOutTime string) (*model.WorkRecord, error) {
	return s.repo.CreateWorkRecord(userId, clockOutTime)
}
