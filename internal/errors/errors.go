package errors

import "errors"

var (
	// USER
	ErrAllFieldsRequired = errors.New("모든 항목을 입력해주세요.")
	ErrUsernameAlreadyExists = errors.New("이미 존재하는 사용자입니다.")

	//// Login 
	ErrUserNotFound = errors.New("사용자를 찾을 수 없습니다.")
	ErrGenerateToken = errors.New("토큰을 발급할 수 없습니다.")
	ErrInternalServer = errors.New("서버 내부 오류가 발생했습니다.")

	// BCRYPT
	ErrBCRYPT_COSTNotSet = errors.New("BCRYPT의 비용이 설정되지 않았습니다.")
	ErrInvalidPassword = errors.New("비밀번호가 일치하지 않습니다.")
)
