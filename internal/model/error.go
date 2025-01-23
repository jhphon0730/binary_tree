package model 

import "errors"

var (
	ErrAllFieldsRequired = errors.New("모든 항목을 입력해주세요.")
	ErrUsernameAlreadyExists = errors.New("이미 존재하는 사용자입니다.")
)
