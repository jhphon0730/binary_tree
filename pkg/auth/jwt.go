package auth

import (
	"binary_tree/internal/config"
	"binary_tree/internal/errors"

	"github.com/golang-jwt/jwt/v5"

	"time"
)

var (
	jwtSecret  []byte = []byte(config.GetConfig().JWT_SECRET)
)

type TokenClaims struct {
	UserID int `json:"userID"`
	jwt.RegisteredClaims
}

// 토큰 생성 함수
func GenerateJWT(userID int) (string, error) {
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

// 토큰을 검증하고, 유효하면 데이터를 반환하는 함수
func ValidateAndParseJWT(tokenString string) (*TokenClaims, error) {
	// 토큰을 파싱하고 클레임을 추출
	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.ErrInvalidToken
		}
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}

	// 토큰이 유효한지 확인하고, 유효한 경우 클레임을 반환
	if claims, ok := token.Claims.(*TokenClaims); ok && token.Valid {
		// 만료 여부 확인
		if claims.ExpiresAt.Time.Before(time.Now()) {
			return nil, errors.ErrExpiredToken
		}
		return claims, nil
	}

	return nil, errors.ErrInvalidToken
}
