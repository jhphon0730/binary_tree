package redis

import (
	"github.com/go-redis/redis/v8"

	"time"
	"errors"
	"strconv"
)

// 사용자 로그인 세션을 Redis에 저장하는 함수
func SetUserLoginSession(userID int, token string) error {
	// Redis에 저장할 key
	key := "user_login_session:" + strconv.Itoa(userID)

	// TTL을 1시간으로 설정
	ttl := time.Hour

	// userID에 해당하는 로그인 세션 정보를 저장
	err := redis_instance.Set(ctx, key, token, ttl).Err()
	return err
}

// 사용자 로그아웃 시 Redis에서 로그인 세션을 삭제하는 함수
func DeleteUserLoginSession(userID int) error {
	// Redis에서 세션 삭제
	key := "user_login_session:" + strconv.Itoa(userID)
	err := redis_instance.Del(ctx, key).Err()
	return err
}

// 사용자 로그인 세션을 Redis에서 가져오는 함수
func GetUserLoginSession(userID int) (string, error) {
	// Redis에서 세션 가져오기
	key := "user_login_session:" + strconv.Itoa(userID)
	token, err := redis_instance.Get(ctx, key).Result()
	// token이 없으면 에러 반환 ( 만료로 인한 삭제도 에러로 처리 )
	if err == redis.Nil {
		return "", errors.New("Session not found")
	}
	return token, err
}
