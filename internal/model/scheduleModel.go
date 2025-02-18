package model

import (
	"gorm.io/gorm"

	"time"
)

/*
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    couple_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,  
    description TEXT,             
    start_date DATE NOT NULL,     
    end_date DATE NOT NULL,       
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('anniversary', 'daily', 'party', 'work', 'holiday', 'reminder', 'custom')),

    -- 반복 일정 관련 필드
    repeat_type VARCHAR(10) CHECK (repeat_type IN ('yearly', 'monthly', 'daily', NULL)), -- 반복 주기
    repeat_until DATE,  -- 반복 종료일 (NULL이면 무한 반복)

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE schedule_details (
    id SERIAL PRIMARY KEY,
    schedule_id INT NOT NULL,      -- 어떤 일정(schedules) 소속인지
    title VARCHAR(255) NOT NULL,   -- 세부 일정 제목 (예: "A에 대한 회의", "점심")
    description TEXT,              -- 세부 일정 설명
    start_time TIME NOT NULL,      -- 시작 시간 (HH:MM:SS)
    end_time TIME NOT NULL,        -- 종료 시간 (HH:MM:SS)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

*/

type Schedule struct {
	gorm.Model

	// User
	CoupleID uint `json:"couple_id" gorm:"not null" binding:"required" validate:"required"`  // 어떤 커플의 일기인지
	AuthorID uint `json:"author_id" gorm:"not null" binding:"required" validate:"required"`  // 작성자 ID
	// -- preload
	Couple Couple `gorm:"foreignKey:CoupleID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Author User   `gorm:"foreignKey:AuthorID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	// Deault Fields
	Title     		string    `json:"title" gorm:"type:varchar(255);not null" binding:"required"`
	Description   string    `json:"description" gorm:"type:text;not null" binding:"required"`
	StartDate 		time.Time `json:"start_date" gorm:"not null" binding:"required"`
	EndDate 			time.Time `json:"end_date" gorm:"not null" binding:"required"`
	EventType 		string `json:"event_type" gorm:"type:varchar(50);not null" binding:"required"`

	// Repeat Fields
	RepeatType 	string `json:"repeat_type" gorm:"type:varchar(10);default:NULL"` // ('yearly', 'monthly', 'daily', NULL)
	RepeatUntil time.Time `json:"repeat_until" gorm:"default:NULL"` // 반복 종료일 (NULL이면 무한 반복)

	// Details
	Details []ScheduleDetail `json:"details" gorm:"foreignKey:ScheduleID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`  // 일정 세부 내용들
}

type ScheduleDetail struct {
	gorm.Model

	// Schedule
	ScheduleID uint `json:"schedule_id" gorm:"not null" binding:"required" validate:"required"`  // 어떤 일정(schedules) 소속인지

	// Detail Fields
	Title 	 			string    `json:"title" gorm:"type:varchar(255);not null" binding:"required"`
	Description   string    `json:"description" gorm:"type:text;not null" binding:"required"`
	StartTime 	  time.Time `json:"start_time" gorm:"not null" binding:"required"`
	EndTime 	    time.Time `json:"end_time" gorm:"not null" binding:"required"`
}
