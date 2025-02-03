package dto 

import (
	"binary_tree/internal/errors"

	"regexp"
	"errors"
	"strings"
)

// UserSignUpDTO는 클라이언트로부터 받은 데이터 전송 객체
type UserSignUpDTO struct {
	Username string `form:"username" binding:"required"`
	Name     string `form:"name" binding:"required"`
	Password string `form:"password" binding:"required"`
	Email    string `form:"email" binding:"required"`
}

// 유효성 검사 함수
func (dto *UserSignUpDTO) Validate() error {
	if err := dto.validateUsername(); err != nil {
		return err
	}
	if err := dto.validateEmail(); err != nil {
		return err
	}
	if err := dto.validatePassword(); err != nil {
		return err
	}
	return nil
}

// Username 유효성 검사: 최소 3자 이상
func (dto *UserSignUpDTO) validateUsername() error {
	if len(dto.Username) < 3 {
		return errors.ErrInvalidUsernameFormat
	}
	// 추가 조건: 공백을 허용하지 않음
	if strings.Contains(dto.Username, " ") {
		return errors.ErrContainsSpace
	}
	return nil
}

// Email 유효성 검사: 정규식을 사용한 이메일 형식 검사
func (dto *UserSignUpDTO) validateEmail() error {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !re.MatchString(dto.Email) {
		return errors.ErrInvalidEmailFormat
	}
	return nil
}

// Password 유효성 검사: 최소 8자 이상, 대소문자, 숫자 포함
func (dto *UserSignUpDTO) validatePassword() error {
	if len(dto.Password) < 8 {
		return errors.ErrInvalidPasswordFormat
	}
	// 대소문자, 숫자 포함 체크
	hasUpper := false
	hasLower := false
	hasDigit := false
	for _, char := range dto.Password {
		switch {
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		case char >= '0' && char <= '9':
			hasDigit = true
		}
	}
	if !hasUpper || !hasLower || !hasDigit {
		return errors.ErrInvalidPasswordFormat
	}
	return nil
}

type UserSignInDTO struct {
	Username string `form:"username" binding:"required"`
	Password string `form:"password" binding:"required"`
}

// 유효성 검사 함수
func (dto *UserSignInDTO) Validate() error {
	if err := dto.validateUsername(); err != nil {
		return err
	}
	if err := dto.validatePassword(); err != nil {
		return err
	}
	return nil
}

// Username 유효성 검사: 최소 3자 이상
func (dto *UserSignInDTO) validateUsername() error {
	if len(dto.Username) < 3 {
		return errors.ErrInvalidUsernameFormat
	}
	// 추가 조건: 공백을 허용하지 않음
	if strings.Contains(dto.Username, " ") {
		return errors.ErrContainsSpace
	}
	return nil
}

// Password 유효성 검사: 최소 8자 이상
func (dto *UserSignInDTO) validatePassword() error {
	if len(dto.Password) < 8 {
		return errors.ErrInvalidPasswordFormat
	}
	// 대소문자, 숫자 포함 체크
	hasUpper := false
	hasLower := false
	hasDigit := false
	for _, char := range dto.Password {
		switch {
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		case char >= '0' && char <= '9':
			hasDigit = true
		}
	}
	if !hasUpper || !hasLower || !hasDigit {
		return errors.ErrInvalidPasswordFormat
	}
	return nil
}
