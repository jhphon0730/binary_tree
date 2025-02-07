package service 

import (
	"binary_tree/internal/model"
	"binary_tree/internal/errors"

	"gorm.io/gorm"
)

type CoupleService interface {
	CreateCouple(userID1, userID2 uint) error
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
		User1ID: userID1,
		User2ID: userID2,
		StartDate: "",
		SharedNote: "내용을 작성해보세요.",
	}

	if err := c.DB.Create(&couple).Error; err != nil {
		return errors.ERRCannotCreateCouple
	}

	return nil
}
