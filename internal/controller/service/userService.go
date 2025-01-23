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

// 사용자가 이미 존재하는지 확인
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

// 사용자 회원가입 / 등록
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
