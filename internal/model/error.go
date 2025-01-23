package model 

import "errors"

var (
	// USER
	ErrAllFieldsRequired = errors.New("모든 항목을 입력해주세요.")
	ErrUsernameAlreadyExists = errors.New("이미 존재하는 사용자입니다.")

	// BCRYPT
	ErrBCRYPT_COSTNotSet = errors.New("BCRYPT의 비용이 설정되지 않았습니다.")
	ErrInvalidPassword = errors.New("비밀번호가 일치하지 않습니다.")
)
