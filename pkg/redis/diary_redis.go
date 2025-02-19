package redis

import (
	"binary_tree/internal/model"
	"binary_tree/internal/config"
	"binary_tree/internal/errors"

	"github.com/go-redis/redis/v8"

	"log"
	"sync"
	"strconv"
	"context"
	"encoding/json"
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

func GetDiaryRedis(ctx context.Context) *redis.Client {
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

/* 다이어리를 생성하면 coupleID : Diary 형식으로 Redis에 저장
	* 해당 커플이 마지막에 생성한 다이어리를 저장하기 위함
	* 다이어리를 생성할 때마다 해당 커플의 최근 생성 다이어리를 갱신
*/
func SetLatestDiary(ctx context.Context, diary model.Diary) error {
	// 기존에 저장한 다이어리가 있으면 삭제
	_ = DeleteLatestDiary(ctx, diary.CoupleID)

	key := "diary_latest:" + strconv.Itoa(int(diary.CoupleID))

	data, err := json.Marshal(diary)
	if err != nil {
		return errors.ErrCannotSaveLatestDiary
	}

	return diaryRedisInstance.Set(ctx, key, data, 0).Err()
}

/* coupleID를 통해 해당 커플의 최근 생성 다이어리를 가져옴 */
func GetLatestDiary(ctx context.Context, coupleID uint) (model.Diary, error) {
	key := "diary_latest:" + strconv.Itoa(int(coupleID))

	data, err := diaryRedisInstance.Get(ctx, key).Result()
	if err != nil {
		return model.Diary{}, errors.ErrDiaryNotFound
	}

	var diary model.Diary
	err = json.Unmarshal([]byte(data), &diary)
	if err != nil {
		return model.Diary{}, errors.ErrCannotGetLatestDiary
	}

	return diary, nil
}

/* 다이어리를 삭제하면 해당 커플의 최근 생성 다이어리를 삭제 
	* 다이어리를 삭제할 때마다 해당 커플의 최근 생성 다이어리를 갱신
*/
func DeleteLatestDiary(ctx context.Context, coupleID uint) error {
	key := "diary_latest:" + strconv.Itoa(int(coupleID))
	return diaryRedisInstance.Del(ctx, key).Err()
}
