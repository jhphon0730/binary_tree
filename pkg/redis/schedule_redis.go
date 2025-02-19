package redis

import (
	"binary_tree/internal/model"
	"binary_tree/internal/config"
	"binary_tree/internal/errors"
	"binary_tree/internal/database"

	"github.com/go-redis/redis/v8"

	"log"
	"fmt"
	"time"
	"sync"
	"context"
)

var (
	scheduleRedisInstance *redis.Client
	scheduleOnce					sync.Once
)

// Redis 초기화 함수
func InitScheduleRedisInstance(ctx context.Context) error {
	scheduleRedisInstance = redis.NewClient(&redis.Options{
		Addr:     config.GetConfig().Redis.Host,
		Password: config.GetConfig().Redis.Password,
		DB:       config.GetConfig().Redis.ScheduleDB,
	})

	_, err := scheduleRedisInstance.Ping(ctx).Result()
	if err != nil {
		return errors.ErrFailedToConnectRedis
	}
	return nil
}

func getScheduleRedis(ctx context.Context) *redis.Client {
	scheduleOnce.Do(func() {
		InitScheduleRedisInstance(ctx)
	})
	return scheduleRedisInstance
}

func CloseScheduleRedis() {
	if scheduleRedisInstance == nil {
		log.Println("Redis connection not initialized or already closed.")
		return
	}
	log.Println("Closing redis connection...")
	err := scheduleRedisInstance.Close()
	if err != nil {
		log.Fatalf("Error closing redis: %v", err)
	}
	log.Println("Redis connection closed!")
}

/* 새로운 일정 추가 시, Redis에 저장
	- schedule_today:coupleID에 저장
	* 해당 일정이 오늘을 포함하는 일정이면 오늘의 일정에 추가
*/
func AddScheduleToRedis(ctx context.Context, coupleID int, schedule model.Schedule) error {
	redisClient := getScheduleRedis(ctx)

	today := time.Now()
	todayStr := today.Format("2006-01-02")
	startStr := schedule.StartDate.Format("2006-01-02")
	endStr := schedule.EndDate.Format("2006-01-02")

	// 오늘 포함된 일정이면 schedule_today:coupleID에 저장
	if (schedule.StartDate.Before(today) || startStr == todayStr) && 
	   (schedule.EndDate.After(today) || endStr == todayStr) {
		todayKey := fmt.Sprintf("schedule_today:%d", coupleID)
		err := redisClient.SAdd(ctx, todayKey, schedule.ID).Err()
		if err != nil {
			return err
		}
	}

	return nil
}

/* 반복 일정이 아닌 일정이지만 오늘 일정에 포함되는지 확인하여 Redis에 저장 (매일 새벽 5시 실행)
	- schedule_today:coupleID에 저장
	- repeat_type은 "" (빈 문자열) 이어야 함
*/
func UpdateDailySchedulesInRedis(ctx context.Context) error {
	redisClient := getScheduleRedis(ctx)
	db := database.GetDB()

	today := time.Now()
	todayStr := today.Format("2006-01-02")

	var schedules []model.Schedule
	err := db.Where("repeat_type = ''").Find(&schedules).Error
	if err != nil {
		return err
	}

	// 일정 추가를 위한 Redis pipeline 사용 (속도 개선)
	pipe := redisClient.Pipeline()
	for _, schedule := range schedules {
		startStr := schedule.StartDate.Format("2006-01-02")
		endStr := schedule.EndDate.Format("2006-01-02")

		if (schedule.StartDate.Before(today) || startStr == todayStr) &&
			(schedule.EndDate.After(today) || endStr == todayStr) {
			todayKey := fmt.Sprintf("schedule_today:%d", schedule.CoupleID)
			pipe.SAdd(ctx, todayKey, schedule.ID)
		}
	}
	_, err = pipe.Exec(ctx)
	return err
}

// 반복 일정을 오늘 일정에 추가하는 함수 (매일 새벽 5시 실행)
func UpdateDailyRepeatSchedulesInRedis(ctx context.Context) error {
	redisClient := getScheduleRedis(ctx)
	db := database.GetDB()

	today := time.Now()
	day := today.Day()
	month := today.Month()

	var schedules []model.Schedule
	err := db.Where("repeat_type IN (?, ?, ?)", "daily", "monthly", "yearly").Find(&schedules).Error
	if err != nil {
		return err
	}

	// Redis pipeline 사용
	pipe := redisClient.Pipeline()
	for _, schedule := range schedules {
		if schedule.RepeatUntil.Before(today) {
			continue
		}

		// 시작일이 오늘 이후이면 반복 일정에 추가하지 않음
		if schedule.StartDate.After(today) {
			continue
		}


		if schedule.RepeatType == "daily" ||
			(schedule.RepeatType == "monthly" && schedule.StartDate.Day() == day) ||
			(schedule.RepeatType == "yearly" && schedule.StartDate.Day() == day && schedule.StartDate.Month() == month) {

			todayKey := fmt.Sprintf("schedule_repeat_today:%d", schedule.CoupleID)
			pipe.SAdd(ctx, todayKey, schedule.ID)
		}
	}
	_, err = pipe.Exec(ctx)
	return err
}

// Redis에 저장된 오늘 일정 및 반복 일정 삭제
func ClearDailySchedulesInRedis(ctx context.Context) error {
	redisClient := getScheduleRedis(ctx)

	// `schedule_today:*`와 `schedule_repeat_today:*` 키 삭제
	keys, _ := redisClient.Keys(ctx, "schedule_today:*").Result()
	repeatKeys, _ := redisClient.Keys(ctx, "schedule_repeat_today:*").Result()

	keys = append(keys, repeatKeys...)
	if len(keys) > 0 {
		return redisClient.Del(ctx, keys...).Err()
	}
	return nil
}

// 오늘 일정 및 반복 일정을 Redis에서 가져오는 함수
func RunDailyScheduleUpdate(ctx context.Context) error {
	// 1. Redis 초기화 (기존 일정 삭제)
	if err := ClearDailySchedulesInRedis(ctx); err != nil {
		return err
	}

	// 2. 반복 일정이 아닌 일정 추가
	if err := UpdateDailySchedulesInRedis(ctx); err != nil {
		return err
	}

	// 3. 반복 일정 추가
	if err := UpdateDailyRepeatSchedulesInRedis(ctx); err != nil {
		return err
	}

	return nil
}
