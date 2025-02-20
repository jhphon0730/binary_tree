package model

import (
	"gorm.io/gorm"

	"time"
)

type Schedule struct {
	gorm.Model

	// User
	CoupleID uint `json:"couple_id" gorm:"not null" binding:"required" validate:"required"`
	AuthorID uint `json:"author_id" gorm:"not null" binding:"required" validate:"required"`

	// Foreign Keys
	Couple Couple `gorm:"foreignKey:CoupleID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Author User   `gorm:"foreignKey:AuthorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	// Default Fields
	Title       string    `json:"title" gorm:"type:varchar(255);not null" binding:"required"`
	Description string    `json:"description" gorm:"type:text;not null" binding:"required"`
	StartDate   time.Time `json:"start_date" gorm:"not null" binding:"required"`
	EndDate     time.Time `json:"end_date" gorm:"not null" binding:"required"`
	EventType   string    `json:"event_type" gorm:"type:varchar(50);not null" binding:"required"`

	// Repeat Fields
	RepeatType  string     `json:"repeat_type" gorm:"type:varchar(10);default:''"` // ('yearly', 'monthly', 'daily')
	RepeatUntil *time.Time `json:"repeat_until" gorm:"default:NULL"` // NULL이면 무한 반복

	// Details
	Details []ScheduleDetail `json:"details" gorm:"foreignKey:ScheduleID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type ScheduleDetail struct {
	gorm.Model

	// Schedule
	ScheduleID uint `json:"schedule_id" gorm:"not null" binding:"required" validate:"required"`

	// Detail Fields
	Title       string `json:"title" gorm:"type:varchar(255);not null" binding:"required"`
	Description string `json:"description" gorm:"type:text;not null" binding:"required"`
	StartTime   string `json:"start_time" gorm:"type:text;not null" binding:"required"` // "HH:MM:SS" 형식
	EndTime     string `json:"end_time" gorm:"type:text;not null" binding:"required"`   // "HH:MM:SS" 형식
}

func (s *Schedule) Save(db *gorm.DB) error {
	return db.Save(s).Error
}

func (s *Schedule) Delete(db *gorm.DB) error {
	return db.Delete(s).Error
}

// FindScheduleByID
func FindScheduleByID(db *gorm.DB, scheduleID uint) (*Schedule, error) {
	var schedule Schedule
	if err := db.Where("id = ?", scheduleID).First(&schedule).Error; err != nil {
		return nil, err
	}

	return &schedule, nil
}

// FindScheduleByIDWithDetails
func FindScheduleByIDWithDetails(db *gorm.DB, scheduleID uint) (*Schedule, error) {
	var schedule Schedule
	if err := db.Preload("Details").Where("id = ?", scheduleID).First(&schedule).Error; err != nil {
		return nil, err
	}

	return &schedule, nil
}
