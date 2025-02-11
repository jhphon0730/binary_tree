package service

import (
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"

	"binary_tree/pkg/utils"

	"net/http"
	"gorm.io/gorm"
)

type DiaryService interface {
	CreateDiary(userID uint, coupleID uint, createDTO dto.CreateDiaryDTO) (model.Diary, int, error)
}

type diaryService struct {
	DB *gorm.DB
}

func NewDiaryService(db *gorm.DB) DiaryService {
	return &diaryService{
		DB: db,
	}
}

// 새로운 다이어리를 생성
func (d *diaryService) CreateDiary(userID uint, coupleID uint, createDTO dto.CreateDiaryDTO) (model.Diary, int, error) {
	// coupelID가 유효한지 확인
	if err := d.DB.First(&model.Couple{}, coupleID).Error; err != nil {
		return model.Diary{}, http.StatusNotFound, err
	}

	created := model.Diary {
		CoupleID: coupleID,
		AuthorID: userID,

		Title: createDTO.Title,
		Content: createDTO.Content,
		Emotion: createDTO.Emotion,
		DiaryDate: createDTO.DiaryDate,
	}

	if err := d.DB.Create(&created).Error; err != nil {
		return model.Diary{}, http.StatusInternalServerError, err
	}

	if createDTO.Images != nil {
		for _, image := range createDTO.Images {
			imagePath, err := utils.UploadProfileImage(image)
			if err != nil {
				return model.Diary{}, http.StatusInternalServerError, err
			}

			diaryImage := model.DiaryImage {
				DiaryID: created.ID,
				ImageURL: imagePath,
			}

			if err := d.DB.Create(&diaryImage).Error; err != nil {
				return model.Diary{}, http.StatusInternalServerError, err
			}

			created.Images = append(created.Images, diaryImage)
		}
	}

	return created, http.StatusCreated, nil
}
