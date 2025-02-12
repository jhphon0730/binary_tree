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
	var created model.Diary

	// 트랜잭션 처리
	err := d.DB.Transaction(func(tx *gorm.DB) error {
		created = model.Diary{
			CoupleID:  coupleID,
			AuthorID:  userID,
			Title:     createDTO.Title,
			Content:   createDTO.Content,
			Emotion:   createDTO.Emotion,
			DiaryDate: createDTO.DiaryDate,
		}

		if err := tx.Create(&created).Error; err != nil {
			return err // 다이어리 저장 실패 시 롤백
		}

		if createDTO.Images != nil {
			for _, image := range createDTO.Images {
				imagePath, err := utils.UploadDiaryImage(image)
				if err != nil {
					return err // 이미지 업로드 실패 시 롤백
				}

				diaryImage := model.DiaryImage{
					DiaryID:  created.ID,
					ImageURL: imagePath,
				}

				if err := tx.Create(&diaryImage).Error; err != nil {
					return err // 이미지 DB 저장 실패 시 롤백
				}

				// 반환용 이미지 추가
				created.Images = append(created.Images, diaryImage)
			}
		}

		// 모든 작업이 성공하면 nil 반환 → 트랜잭션 커밋
		return nil
	})

	// 트랜잭션 실패 시 에러 처리
	if err != nil {
		return model.Diary{}, http.StatusInternalServerError, err
	}

	return created, http.StatusCreated, nil
}
