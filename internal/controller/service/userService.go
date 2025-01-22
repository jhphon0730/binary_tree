package service

import (
	"gorm.io/gorm"
)

type UserService interface {
	SignUpUser()
}

type userService struct {
	DB *gorm.DB
}

func NewUserService(DB *gorm.DB) UserService {
	return &userService{
		DB: DB,
	}
}

func (u *userService) SignUpUser() {
	// do something
}
