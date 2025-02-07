package service 

import (
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

	return nil
}
