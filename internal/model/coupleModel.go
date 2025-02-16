// 처음에는 사귄 날짜랑 메모만 저장하더라도, 나중에 기념일, 공동 프로필 사진, 커플 고유 설정 같은 추가 정보가 필요, Couple 테이블이 있으면 이런 데이터를 쉽게 확장

package model

import (
	"gorm.io/gorm"

	"fmt"
)

type Couple struct {
	gorm.Model

	User1ID uint `json:"user1_id" gorm:"unique;not null" binding:"required" validate:"required"`
	User2ID uint `json:"user2_id" gorm:"unique;not null" binding:"required" validate:"required"`

	// 외래 키 설정
	User1 User `gorm:"foreignKey:User1ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	User2 User `gorm:"foreignKey:User2ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	StartDate  string `json:"start_date" gorm:"default:null"`
	SharedNote string `json:"shared_note" gorm:"default:null"`

	// 커플 고유 인덱스 (두 사용자 조합에 대한 유일성 보장)
	UniqueIndex string `gorm:"uniqueIndex:idx_partner_pair"`
}

func (c *Couple) BeforeCreate(tx *gorm.DB) (err error) {
	if c.User1ID > c.User2ID {
		c.User1ID, c.User2ID = c.User2ID, c.User1ID
	}
	c.UniqueIndex = fmt.Sprintf("%d_%d", c.User1ID, c.User2ID)
	return
}

// 사용자 아이디로 커플 정보 조회
func GetCoupleByUserID(DB *gorm.DB, userID uint) (Couple, error) {
	var couple Couple
	if err := DB.Where("user1_id = ? OR user2_id = ?", userID, userID).First(&couple).Error; err != nil {
		return couple, err
	}
	return couple, nil
}
