package service

import (
	"gorm.io/gorm"
)

type DiaryService interface {}

type diaryService struct {
	DB *gorm.DB
}

func NewDiaryService(db *gorm.DB) DiaryService {
	return &diaryService{
		DB: db,
	}
}

