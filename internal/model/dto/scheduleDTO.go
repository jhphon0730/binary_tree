package dto

import (
	"binary_tree/internal/model"

	"time"
)

type CreateScheduleDTO struct {
	Title 			string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	StartDate 	time.Time `json:"start_date" binding:"required"`
	EndDate 		time.Time `json:"end_date" binding:"required"`
	EventType 	string `json:"event_type" binding:"required"`

	RepeatType 	string `json:"repeat_type"`
	RepeatUntil *time.Time `json:"repeat_until"`
}

type UpdateScheduleDTO struct {
	Title 			string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	StartDate 	time.Time `json:"start_date" binding:"required"`
	EndDate 		time.Time `json:"end_date" binding:"required"`
	EventType 	string `json:"event_type" binding:"required"`

	RepeatType 	string `json:"repeat_type"`
	RepeatUntil *time.Time `json:"repeat_until"`

	NewDetails []model.ScheduleDetail `json:"new_details"`
	UpdateDetails []model.ScheduleDetail `json:"update_details"`
	DeleteDetails []int `json:"delete_details"`
}
