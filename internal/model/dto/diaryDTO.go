package dto

import (
	"mime/multipart"
)

type CreateDiaryDTO struct {
	Title string `form:"title" binding:"required"`
	Content string `form:"content" binding:"required"`
	Emotion string `form:"emotion"`
	DiaryDate string `form:"diary_date" binding:"required"`

	Images []*multipart.FileHeader `form:"images"`
}
