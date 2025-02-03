package model

import (
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
