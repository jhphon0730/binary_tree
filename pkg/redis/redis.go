// redis:latest 0.0.0.0:6379->6379/tcp, :::6379->6379/tcp redis

package redis

import (
	"binary_tree/internal/config"

	"github.com/go-redis/redis/v8"

	"log"
	"sync"
	"errors"
	"context"
)

var (
	redis_instance *redis.Client
	once sync.Once

	ctx = context.Background()
)

func InitRedis() error {
	log.Println("Connecting to redis...")

	redis_instance = redis.NewClient(&redis.Options{
		Addr:     config.GetConfig().Redis.Host,
		Password: config.GetConfig().Redis.Password,
		DB:       config.GetConfig().Redis.DB,
	})

	_, err := redis_instance.Ping(context.Background()).Result()
	if err != nil {
		return errors.New("Failed to connect to redis")
	}

	log.Println("Redis connection established!")
	return nil
}

func GetRedis() *redis.Client {
	once.Do(func() {
		InitRedis()
	})
	return redis_instance
}

func CloseRedis() {
	log.Println("Closing redis connection...")
	err := redis_instance.Close()
	if err != nil {
		log.Fatalf("Error closing redis: %v", err)
	}
	log.Println("Redis connection closed!")
}
