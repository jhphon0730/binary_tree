package model

import (
	"binary_tree/internal/errors"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique" binding:"required" validate:"required"`
	Name     string `json:"name" binding:"required" validate:"required"`
	Email    string `json:"email" gorm:"unique" binding:"required" validate:"required,email"`
	Password string `json:"password" binding:"required" validate:"required"`
	ProfileImageFile string `json:"profile_image_file" gorm:"default:media/user_profile_images/defult.png"` // 프로필 이미지 URL

	PartnerID *uint `json:"partner_id" gorm:"default:null"` // 연결된 파트너 ( 상대 사용자의 ID )
}

func FindUserByUsername(DB *gorm.DB, username string) (User, error) {
	var user User
	if err := DB.Where("username = ?", username).First(&user).Error; err != nil {
		return User{}, errors.ErrCannotFindUser
	}
	return user, nil
}

func FindUserByEmail(DB *gorm.DB, email string) (User, error) {
	var user User
	if err := DB.Where("email = ?", email).First(&user).Error; err != nil {
		return User{}, errors.ErrCannotFindUser
	}
	return user, nil
}

func FindUserByID(DB *gorm.DB, id uint) (User, error) {
	var user User
	if err := DB.Where("id = ?", id).First(&user).Error; err != nil {
		return User{}, errors.ErrCannotFindUser
	}
	return user, nil
}
