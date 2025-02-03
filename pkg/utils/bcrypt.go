package utils

import (
	"binary_tree/internal/errors"
	"binary_tree/internal/config"

	"golang.org/x/crypto/bcrypt"

	"strconv"
)

var (
	BCRYPT_COST int = 5
)

func InitBcrypt() error {
	// 환경 설정에서 BCRYPT_COST 로드 시도
	if cost, err := strconv.Atoi(config.GetConfig().BCRYPT_COST); err == nil {
		BCRYPT_COST = cost
		return nil
	}
	return errors.ErrBCRYPT_COSTNotSet
}

// 비밀번호 암호화
func EncryptPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), BCRYPT_COST)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

// 비밀번호 확인 함수
func ComparePassword(password, hash string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return errors.ErrInvalidPassword
	}
	return nil
}
