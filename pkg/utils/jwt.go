package utils

import (
	"binary_tree/internal/config"

	"github.com/golang-jwt/jwt/v5"

	"time"
	"errors"
)

var (
	jwtSecret  []byte = []byte(config.GetConfig().JWT_SECRET)
)

type TokenClaims struct {
	UserID string `json:"userID"`
	jwt.RegisteredClaims
}

// 토큰 생성 함수
func GenerateJWT(userID string) (string, error) {
	claims := TokenClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 1)), // 1시간 만료
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// 토큰 유효성 검사 함수
func ValidateJWT(tokenString string) (bool, error) {
	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})
	if err != nil {
		return false, err
	}

	// 토큰이 유효한 경우
	if claims, ok := token.Claims.(*TokenClaims); ok && token.Valid {
		// 만료 여부 확인
		if claims.ExpiresAt.Time.Before(time.Now()) {
			return false, errors.New("token has expired")
		}
		return true, nil
	}

	return false, errors.New("invalid token")
}

// 토큰에서 데이터를 추출하여 구조체로 반환
func ParseJWT(tokenString string) (*TokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*TokenClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("failed to parse token")
}
