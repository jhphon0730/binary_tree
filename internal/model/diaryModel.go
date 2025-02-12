package model

import (
	"gorm.io/gorm"
	"time"
)

type Diary struct {
	gorm.Model

	CoupleID uint `json:"couple_id" gorm:"not null" binding:"required" validate:"required"`  // 어떤 커플의 일기인지
	AuthorID uint `json:"author_id" gorm:"not null" binding:"required" validate:"required"`  // 작성자 ID

	Couple Couple `gorm:"foreignKey:CoupleID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Author User   `gorm:"foreignKey:AuthorID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Title     string    `json:"title" gorm:"type:varchar(255);not null" binding:"required"`
	Content   string    `json:"content" gorm:"type:text;not null" binding:"required"`
	Emotion   string    `json:"emotion" gorm:"type:varchar(50)"`                              // 감정 상태 (선택 사항)
	DiaryDate time.Time `json:"diary_date" gorm:"not null" binding:"required"`                // 일기 날짜 (작성일과 다를 수 있음)

	Images []DiaryImage `json:"images" gorm:"foreignKey:DiaryID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`  // 다이어리 이미지들
}

type DiaryImage struct {
	gorm.Model

	DiaryID uint   `json:"diary_id" gorm:"not null" binding:"required" validate:"required"`  // 다이어리와 연결
	ImageURL string `json:"image_url" gorm:"type:text;not null"`                            // 이미지 URL
}
