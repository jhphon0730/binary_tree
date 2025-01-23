package service

import (
	"binary_tree/internal/model"
	"binary_tree/internal/model/DTO"

	"gorm.io/gorm"
)

type UserService interface {
	CheckUserExists(username string) (error)
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

// Check if the user already exists in the database
func (u *userService) CheckUserExists(username string) (error) {
	var count int64
	if err := u.DB.Model(&model.User{}).Where("username = ?", username).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return model.ErrUsernameAlreadyExists
	}
	return nil
}

func (u *userService) SignUpUser(userDTO dto.UserSignUpDTO) (model.User, error) {
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
