package model

import (
	"gorm.io/gorm"
)

// signup: ['id', 'username', 'name', 'email', 'password']
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique" binding:"required" validate:"required"`
	Name string `json:"name" binding:"required" validate:"required"`
	Email string `json:"email" gorm:"unique" binding:"required" validate:"required,email"`
	Password string `json:"password" binding:"required" validate:"required"`
}

