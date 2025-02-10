package service

import (
	"binary_tree/internal/errors"
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"

	"gorm.io/gorm"
)

type CoupleService interface {
	CreateCouple(userID1, userID2 uint) error
	GetCoupleInfo(userID uint) (*model.Couple, error)
	UpdateSharedNote(userID uint, sharedNoteDTO dto.UpdateSharedNoteDTO) error
	UpdateStartDate(userID uint, startDateDTO dto.UpdateStartDateDTO) error
}

type coupleService struct {
	DB *gorm.DB
}

func NewCoupleService(db *gorm.DB) CoupleService {
	return &coupleService{
		DB: db,
	}
}

// 두 사용자의 ID를 받아 커플로 만들어줌
func (c *coupleService) CreateCouple(userID1, userID2 uint) error {
	couple := model.Couple{
		User1ID:    userID1,
		User2ID:    userID2,
		StartDate:  "",
		SharedNote: "내용을 작성해보세요.",
	}

	if err := c.DB.Create(&couple).Error; err != nil {
		return errors.ERRCannotCreateCouple
	}

	return nil
}

// 커플 정보를 가져옴
func (c *coupleService) GetCoupleInfo(userID uint) (*model.Couple, error) {
	var couple model.Couple
	result := c.DB.Where("user1_id = ? OR user2_id = ?", userID, userID).First(&couple)
	if result.Error != nil {
		return nil, errors.ErrCannotFindCouple
	}

	return &couple, nil
}

// 커플끼리의 메모를 수정
func (c *coupleService) UpdateSharedNote(userID uint, sharedNoteDTO dto.UpdateSharedNoteDTO) error {
	result := c.DB.Model(&model.Couple{}).
		Where("user1_id = ? OR user2_id = ?", userID, userID).
		Update("shared_note", sharedNoteDTO.SharedNote)

	if result.Error != nil {
		return errors.ErrCannotFindCouple
	}
	if result.RowsAffected == 0 {
		return errors.ErrCannotFindCouple
	}

	return nil
}

// 커플끼리의 연애 시작일을 수정
func (c *coupleService) UpdateStartDate(userID uint, startDateDTO dto.UpdateStartDateDTO) error {
	result := c.DB.Model(&model.Couple{}).
		Where("user1_id = ? OR user2_id = ?", userID, userID).
		Update("start_date", startDateDTO.StartDate)

	if result.Error != nil {
		return errors.ErrCannotFindCouple
	}
	if result.RowsAffected == 0 {
		return errors.ErrCannotFindCouple
	}

	return nil
}
