package dto

import (
	"binary_tree/internal/errors"

	"time"
	"mime/multipart"
)

type CreateDiaryDTO struct {
	Title string `form:"title" binding:"required"`
	Content string `form:"content" binding:"required"`
	Emotion string `form:"emotion"`
	DiaryDate time.Time `form:"diary_date" binding:"required"`

	Images []*multipart.FileHeader `form:"images"`
}

func (c *CreateDiaryDTO) Validate() error {
	if c.Title == "" {
		return errors.ErrDiaryTitleIsRequired
	}
	if c.Content == "" {
		return errors.ErrDiaryContentIsRequired
	}
	// jpg, jpeg, png 파일만 허용
	if c.Images != nil {
		for _, image := range c.Images {
			if image.Header.Get("Content-Type") != "image/jpeg" && image.Header.Get("Content-Type") != "image/jpg" && image.Header.Get("Content-Type") != "image/png" {
				return errors.ErrInvalidImageType
			}
		}
	}
	return nil
}

type UpdateDiaryDTO struct {
	Title string `form:"title" binding:"required"`
	Content string `form:"content" binding:"required"`
	Emotion string `form:"emotion"`
	DiaryDate time.Time `form:"diary_date" binding:"required"`

	Images []*multipart.FileHeader `form:"images"` // 추가할 이미지
	DeleteImages []uint `form:"delete_images"` // 삭제할 이미지의 ID
}
