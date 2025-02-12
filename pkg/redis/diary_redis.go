package redis

import (
	"binary_tree/internal/config"
	"binary_tree/internal/errors"
	"context"
	"log"
	"sync"

	"github.com/go-redis/redis/v8"
)

var (
	diaryRedisInstance *redis.Client
	diaryOnce           sync.Once
)

// Redis 초기화 함수
func InitDiaryRedisInstance(ctx context.Context) error {
	diaryRedisInstance = redis.NewClient(&redis.Options{
		Addr:     config.GetConfig().Redis.Host,
		Password: config.GetConfig().Redis.Password,
		DB:       config.GetConfig().Redis.DiaryDB,
	})

	_, err := diaryRedisInstance.Ping(ctx).Result()
	if err != nil {
		return errors.ErrFailedToConnectRedis
	}
	return nil
}

func GetRedisRedis(ctx context.Context) *redis.Client {
	diaryOnce.Do(func() {
		InitDiaryRedisInstance(ctx)
	})
	return diaryRedisInstance
}

func CloseDiaryRedis() {
	if diaryRedisInstance == nil {
		log.Println("Redis connection not initialized or already closed.")
		return
	}
	log.Println("Closing redis connection...")
	err := diaryRedisInstance.Close()
	if err != nil {
		log.Fatalf("Error closing redis: %v", err)
	}
	log.Println("Redis connection closed!")
}

