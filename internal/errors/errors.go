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

	// DTO
	ErrContainsSpace = errors.New("공백을 포함할 수 없습니다.")
	ErrorAllFieldsRequired = errors.New("모든 항목을 입력해주세요.")
	ErrInvalidEmailFormat = errors.New("이메일 형식이 올바르지 않습니다.")
	ErrInvalidPasswordFormat = errors.New("비밀번호는 최소 8자, 대소문자, 숫자를 포함해야 합니다.")
	ErrInvalidUsernameFormat = errors.New("사용자 이름은 최소 3자 이상이어야 합니다.")

	// JWT
	ErrInvalidToken = errors.New("올바르지 않은 토큰입니다.")
	ErrExpiredToken = errors.New("토큰이 만료되었습니다.")

	// REDIS
	ErrFailedToConnectRedis = errors.New("Redis에 연결할 수 없습니다.")
	ErrFailedToSetRedis = errors.New("Redis에 저장할 수 없습니다.")
	ErrFailedToDeleteRedis = errors.New("Redis에서 삭제할 수 없습니다.")
	ErrFailedToGetRedis = errors.New("Redis에서 가져올 수 없습니다.")
	ErrSessionNotFound = errors.New("세션이 존재하지 않습니다.")
)
