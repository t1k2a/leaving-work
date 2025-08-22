package mock

import "leaving-work-api/model"

func GetMockWorkRecords(userID string) []model.WorkRecord {
	return []model.WorkRecord{
		{ID: 1, UserID: userID, ClockOutTime: "2024-07-01T18:30:00Z"},
		{ID: 2, UserID: userID, ClockOutTime: "2024-07-02T18:45:00Z"},
	}
}