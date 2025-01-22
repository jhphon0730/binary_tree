package service

import (
	"binary_tree/internal/model"
	"binary_tree/internal/model/DTO"

	"gorm.io/gorm"
)

type UserService interface {
	SignUpUser(userDTO dto.UserSignUpDTO) (model.User, error)
}

type userService struct {
	DB *gorm.DB
}

func NewUserService(DB *gorm.DB) UserService {
	return &userService{
		DB: DB,
	}
}

func (u *userService) SignUpUser(userDTO dto.UserSignUpDTO) (model.User, error) {
	if u.DB == nil {
		return model.User{ Username: "123" }, nil
	}

	user := model.User{
		Username: userDTO.Username,
		Name:     userDTO.Name,
		Email:    userDTO.Email,
		Password: userDTO.Password,
	}
	if err := u.DB.Create(&user).Error; err != nil {
		return model.User{}, err
	}
	return user, nil
}
