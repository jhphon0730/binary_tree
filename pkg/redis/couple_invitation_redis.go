package redis

import (
	"binary_tree/internal/config"
	"binary_tree/internal/errors"

	"github.com/go-redis/redis/v8"

	"context"
	"encoding/json"
	"log"
	"strconv"
	"sync"
	"time"

)

var (
	coupleInvitationRedisInstance *redis.Client
	coupleInvitationOnce           sync.Once
)

// Redis에 JSON 형태로 저장하기 위한 구조체
type CoupleInvitation struct {
	Code     string `json:"code"`
	SenderID int    `json:"sender_id"`
}

// Redis 초기화 함수
func InitCoupleInvitationRedis(ctx context.Context) error {
	coupleInvitationRedisInstance = redis.NewClient(&redis.Options{
		Addr:     config.GetConfig().Redis.Host,
		Password: config.GetConfig().Redis.Password,
		DB:       config.GetConfig().Redis.CoupleInvitationDB,
	})

	_, err := coupleInvitationRedisInstance.Ping(ctx).Result()
	if err != nil {
		return errors.ErrFailedToConnectRedis
	}
	return nil
}

func GetCoupleInvitationRedis(ctx context.Context) *redis.Client {
	coupleInvitationOnce.Do(func() {
		InitCoupleInvitationRedis(ctx)
	})
	return coupleInvitationRedisInstance
}

func CloseCoupleInvitationRedis() {
	if coupleInvitationRedisInstance == nil {
		log.Println("Redis connection not initialized or already closed.")
		return
	}
	log.Println("Closing redis connection...")
	err := coupleInvitationRedisInstance.Close()
	if err != nil {
		log.Fatalf("Error closing redis: %v", err)
	}
	log.Println("Redis connection closed!")
}

// 초대 코드를 생성하면 Redis에 저장
func SetCoupleInvitation(ctx context.Context, userID int, code string) error {
	key := "couple_invitation:" + strconv.Itoa(userID)
	
	ttl := time.Hour * 24

	invitation := CoupleInvitation{
		Code:     code,
		SenderID: userID,
	}

	data, err := json.Marshal(invitation)
	if err != nil {
		return err
	}

	return coupleInvitationRedisInstance.Set(ctx, key, data, ttl).Err()
}

// 초대 코드를 Redis에서 삭제하는 함수
func DeleteCoupleInvitation(ctx context.Context, userID int) error {
	key := "couple_invitation:" + strconv.Itoa(userID)
	return coupleInvitationRedisInstance.Del(ctx, key).Err()
}

// 초대 코드를 Redis에서 가져오는 함수
func GetCoupleInvitation(ctx context.Context, userID int) (CoupleInvitation, error) {
	key := "couple_invitation:" + strconv.Itoa(userID)

	data, err := coupleInvitationRedisInstance.Get(ctx, key).Result()
	if err != nil {
		return CoupleInvitation{}, err
	}

	var invitation CoupleInvitation
	err = json.Unmarshal([]byte(data), &invitation)
	if err != nil {
		return CoupleInvitation{}, err
	}

	return invitation, nil
}

// 초대 코드를 Redis에 저장할 때 code가 어떤 사용자의 것인지도 같이 저장 (key: code, value: userID)
func SetCoupleInvitationWithCode(ctx context.Context, code string, userID int) error {
	key := "couple_invitation_code:" + code
	ttl := time.Hour * 24

	return coupleInvitationRedisInstance.Set(ctx, key, userID, ttl).Err()
}

// 초대 코드를 Redis에서 가져올 때 code가 어떤 사용자의 것인지도 같이 가져옴
func GetCoupleInvitationWithCode(ctx context.Context, code string) (int, error) {
	key := "couple_invitation_code:" + code

	userID, err := coupleInvitationRedisInstance.Get(ctx, key).Int()
	if err != nil {
		return 0, err
	}

	return userID, nil
}

// 초대 코드를 Redis에서 삭제할 때 code가 어떤 사용자의 것인지도 같이 삭제
func DeleteCoupleInvitationWithCode(ctx context.Context, code string) error {
	key := "couple_invitation_code:" + code
	return coupleInvitationRedisInstance.Del(ctx, key).Err()
}
