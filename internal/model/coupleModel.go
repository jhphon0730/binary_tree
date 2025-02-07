// 처음에는 사귄 날짜랑 메모만 저장하더라도, 나중에 기념일, 공동 프로필 사진, 커플 고유 설정 같은 추가 정보가 필요, Couple 테이블이 있으면 이런 데이터를 쉽게 확장

package model

import (
	"gorm.io/gorm"

	"fmt"
)

type Couple struct {
	gorm.Model

	User1ID uint `json:"user1_id" gorm:"unique" binding:"required" validate:"required"`
	User2ID uint `json:"user2_id" gorm:"unique" binding:"required" validate:"required"`

	StartDate string `json:"start_date" gorm:"default:null"`
	SharedNote string `json:"shared_note" gorm:"default:null"`

	UniqueIndex string `gorm:"uniqueIndex:idx_partner_pair"`
}

func (c *Couple) BeforeCreate(tx *gorm.DB) (err error) {
	if c.User1ID > c.User2ID {
		c.User1ID, c.User2ID = c.User2ID, c.User1ID
	}
	c.UniqueIndex = fmt.Sprintf("%d_%d", c.User1ID, c.User2ID)
	return
}

