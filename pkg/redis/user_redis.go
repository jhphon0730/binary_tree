package redis

import (
	"binary_tree/internal/config"

	"github.com/go-redis/redis/v8"

	"context"
	"errors"
	"log"
	"strconv"
	"sync"
	"time"
)

var (
	user_redis_instance *redis.Client
	user_once           sync.Once
)

func InitUserRedis(ctx context.Context) error {
	user_redis_instance = redis.NewClient(&redis.Options{
		Addr:     config.GetConfig().Redis.Host,
		Password: config.GetConfig().Redis.Password,
		DB:       0,
	})

	_, err := user_redis_instance.Ping(ctx).Result()
	if err != nil {
		return errors.New("Failed to connect to redis")
	}
	return nil
}

func GetUserRedis() *redis.Client {
	user_once.Do(func() {
		ctx := context.Background()
		InitUserRedis(ctx)
	})
	return user_redis_instance
}

func CloseUserRedis() {
	log.Println("Closing redis connection...")
	err := user_redis_instance.Close()
	if err != nil {
		log.Fatalf("Error closing redis: %v", err)
	}
	log.Println("Redis connection closed!")
}

// 사용자 로그인 세션을 Redis에 저장하는 함수
func SetUserLoginSession(ctx context.Context, userID int, token string) error {
	// Redis에 저장할 key
	key := "user_login_session:" + strconv.Itoa(userID)

	// TTL을 1시간으로 설정
	ttl := time.Hour

	// userID에 해당하는 로그인 세션 정보를 저장
	err := user_redis_instance.Set(ctx, key, token, ttl).Err()
	return err
}

// 사용자 로그아웃 시 Redis에서 로그인 세션을 삭제하는 함수
func DeleteUserLoginSession(ctx context.Context, userID int) error {
	// Redis에서 세션 삭제
	key := "user_login_session:" + strconv.Itoa(userID)
	err := user_redis_instance.Del(ctx, key).Err()
	return err
}

// 사용자 로그인 세션을 Redis에서 가져오는 함수
func GetUserLoginSession(ctx context.Context, userID int) (string, error) {
	// Redis에서 세션 가져오기
	key := "user_login_session:" + strconv.Itoa(userID)
	token, err := user_redis_instance.Get(ctx, key).Result()
	// token이 없으면 에러 반환 ( 만료로 인한 삭제도 에러로 처리 )
	if err == redis.Nil {
		return "", errors.New("Session not found")
	}
	return token, err
}
