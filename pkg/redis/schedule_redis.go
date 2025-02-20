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
	"encoding/json"
)

var (
	loc, _ = time.LoadLocation("Asia/Seoul") // 한국 시간으로 변환

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

// coupleID로 반복 일정이 아닌 일정만 오늘 일정에 포함되는지 확인하여 Redis에 저장
func updateDailySchedulesByCoupleID(ctx context.Context, coupleID uint) error {
	redisClient := getScheduleRedis(ctx)
	db := database.GetDB()

	today := time.Now().In(loc)
	todayStr := today.Format("2006-01-02")

	var schedules []model.Schedule
	if err := db.Where("couple_id = ? AND repeat_type = '' OR repeat_type IS NULL", coupleID).Find(&schedules).Error; err != nil {
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
			serialized, err := json.Marshal(schedule)
			if err != nil {
					log.Printf("Failed to serialize schedule ID %d: %v", schedule.ID, err)
					continue // 해당 일정은 건너뜀
			}
			pipe.SAdd(ctx, todayKey, serialized)
		}
	}
	_, err := pipe.Exec(ctx)

	return err
}

// coupleID로 반복 일정을 오늘 일정에 추가하는 함수
func updateDailyRepeatSchedulesByCoupleID(ctx context.Context, coupleID uint) error {
	redisClient := getScheduleRedis(ctx)
	db := database.GetDB()

	today := time.Now().In(loc)
	day := today.Day()
	month := today.Month()

	var schedules []model.Schedule
	if err := db.Where("couple_id = ? AND repeat_type IN (?, ?, ?)", coupleID, "daily", "monthly", "yearly").Find(&schedules).Error; err != nil {
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
			serialized, err := json.Marshal(schedule)
			if err != nil {
					log.Printf("Failed to serialize schedule ID %d: %v", schedule.ID, err)
					continue // 해당 일정은 건너뜀
			}
			pipe.SAdd(ctx, todayKey, serialized)
		}
	}
	_, err := pipe.Exec(ctx)
	return err
}

// CoupleID로 Redis에 저장된 일정을 삭제하는 함수
func clearDailySchedulesByCoupleID(ctx context.Context, coupleID uint) error {
	redisClient := getScheduleRedis(ctx)

	// `schedule_today:coupleID`와 `schedule_repeat_today:coupleID` 키 삭제
	todayKey := fmt.Sprintf("schedule_today:%d", coupleID)
	repeatKey := fmt.Sprintf("schedule_repeat_today:%d", coupleID)

	return redisClient.Del(ctx, todayKey, repeatKey).Err()
}

func RunDailyScheduleUpdateByCoupleID(ctx context.Context, coupleID uint) error {
	// 1. Redis 초기화 (기존 일정 삭제)
	if err := clearDailySchedulesByCoupleID(ctx, coupleID); err != nil {
		return err
	}

	// 2. 반복 일정이 아닌 일정 추가
	if err := updateDailySchedulesByCoupleID(ctx, coupleID); err != nil {
		return err
	}

	// 3. 반복 일정 추가
	if err := updateDailyRepeatSchedulesByCoupleID(ctx, coupleID); err != nil {
		return err
	}

	return nil
}

/* 반복 일정이 아닌 일정이지만 오늘 일정에 포함되는지 확인하여 Redis에 저장 (매일 새벽 5시 실행)
	- schedule_today:coupleID에 저장
	- repeat_type은 "" (빈 문자열) 이어야 함
*/
func updateDailySchedulesInRedis(ctx context.Context) error {
	redisClient := getScheduleRedis(ctx)
	db := database.GetDB()

	today := time.Now().In(loc)
	todayStr := today.Format("2006-01-02")

	var schedules []model.Schedule
	err := db.Where("repeat_type = '' OR repeat_type IS NULL").Find(&schedules).Error
	if err != nil {
		return err
	}

	// 일정 추가를 위한 Redis pipeline 사용 (속도 개선)
	pipe := redisClient.Pipeline()
	for _, schedule := range schedules {
		startStr := schedule.StartDate.Format("2006-01-02")
		endStr := schedule.EndDate.Format("2006-01-02")

		if (schedule.StartDate.Before(today) || startStr == todayStr) && (schedule.EndDate.After(today) || endStr == todayStr) {
			todayKey := fmt.Sprintf("schedule_today:%d", schedule.CoupleID)
			serialized, err := json.Marshal(schedule)
			if err != nil {
					log.Printf("Failed to serialize schedule ID %d: %v", schedule.ID, err)
					continue // 해당 일정은 건너뜀
			}
			pipe.SAdd(ctx, todayKey, serialized)
		}
	}
	_, err = pipe.Exec(ctx)
	return err
}

/* 반복 일정을 오늘 일정에 추가하는 함수 (매일 새벽 5시 실행)
	- schedule_repeat_today:coupleID에 저장
	- repeat_type이 "daily", "monthly", "yearly"인 일정만 추가
*/
func updateDailyRepeatSchedulesInRedis(ctx context.Context) error {
	redisClient := getScheduleRedis(ctx)
	db := database.GetDB()

	today := time.Now().In(loc)
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
			serialized, err := json.Marshal(schedule)
			if err != nil {
					log.Printf("Failed to serialize schedule ID %d: %v", schedule.ID, err)
					continue // 해당 일정은 건너뜀
			}
			pipe.SAdd(ctx, todayKey, serialized)
		}
	}
	_, err = pipe.Exec(ctx)
	return err
}

// Redis에 저장된 오늘 일정 및 반복 일정 삭제
func clearDailySchedulesInRedis(ctx context.Context) error {
	redisClient := getScheduleRedis(ctx)

	// `schedule_today:*`와 `schedule_repeat_today:*` 키 삭제
	return redisClient.Del(ctx, "schedule_today:*", "schedule_repeat_today:*").Err()
}

// 오늘 일정 및 반복 일정을 Redis에서 가져오는 함수
func RunDailyScheduleUpdate(ctx context.Context) error {
	// 1. Redis 초기화 (기존 일정 삭제)
	if err := clearDailySchedulesInRedis(ctx); err != nil {
		return err
	}

	// 2. 반복 일정이 아닌 일정 추가
	if err := updateDailySchedulesInRedis(ctx); err != nil {
		return err
	}

	// 3. 반복 일정 추가
	if err := updateDailyRepeatSchedulesInRedis(ctx); err != nil {
		return err
	}

	return nil
}

// 오늘 일정을 가져오는 함수
func GetDailySchedulesByCoupleID(ctx context.Context, coupleID uint) ([]model.Schedule, error) {
	redisClient := getScheduleRedis(ctx)
	todayKey := fmt.Sprintf("schedule_today:%d", coupleID)

	serialized, err := redisClient.SMembers(ctx, todayKey).Result()
	if err != nil {
		return nil, err
	}

	var schedules []model.Schedule
	for _, s := range serialized {
		var schedule model.Schedule
		if err := json.Unmarshal([]byte(s), &schedule); err != nil {
			log.Printf("Failed to deserialize schedule: %v", err)
			continue
		}
		schedules = append(schedules, schedule)
	}

	return schedules, nil
}

// 오늘 반복 일정을 가져오는 함수
func GetDailyRepeatSchedulesByCoupleID(ctx context.Context, coupleID uint) ([]model.Schedule, error) {
	redisClient := getScheduleRedis(ctx)
	todayKey := fmt.Sprintf("schedule_repeat_today:%d", coupleID)

	serialized, err := redisClient.SMembers(ctx, todayKey).Result()
	if err != nil {
		return nil, err
	}

	var schedules []model.Schedule
	for _, s := range serialized {
		var schedule model.Schedule
		if err := json.Unmarshal([]byte(s), &schedule); err != nil {
			log.Printf("Failed to deserialize schedule: %v", err)
			continue
		}
		schedules = append(schedules, schedule)
	}

	return schedules, nil
}
