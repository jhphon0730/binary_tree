package model

import (
	"gorm.io/gorm"
)

// signup: ['id', 'username', 'name', 'email', 'password']
type User struct {
	gorm.Model
	Username string `json:"username"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
}

