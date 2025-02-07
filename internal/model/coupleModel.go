package model

import (
	"gorm.io/gorm"

	"fmt"
)

type Couple struct {
	gorm.Model

	User1ID uint `json:"user1_id" gorm:"unique" binding:"required" validate:"required"`
	User2ID uint `json:"user2_id" gorm:"unique" binding:"required" validate:"required"`

	StartDate *string `json:"start_date" gorm:"default:null"`
	SharedNote *string `json:"shared_note" gorm:"default:null"`

	UniqueIndex string `gorm:"uniqueIndex:idx_partner_pair"`
}

func (c *Couple) BeforeCreate(tx *gorm.DB) (err error) {
	if c.User1ID > c.User2ID {
		c.User1ID, c.User2ID = c.User2ID, c.User1ID
	}
	c.UniqueIndex = fmt.Sprintf("%d_%d", c.User1ID, c.User2ID)
	return
}

