package mock

import (
    "leaving-work-api/model"
    "time"
)

func GetMockWorkRecords(userID string) []model.WorkRecord {
    const layout = "2006-01-02T15:04:05Z07:00"
    t1, _ := time.Parse(layout, "2024-07-01T18:30:00Z")
    t2, _ := time.Parse(layout, "2024-07-02T18:45:00Z")
    return []model.WorkRecord{
        {ID: 1, UserID: userID, ClockOutTime: t1},
        {ID: 2, UserID: userID, ClockOutTime: t2},
    }
}
