package service

import (
	"binary_tree/internal/errors"
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"

	"binary_tree/pkg/redis"

	"gorm.io/gorm"

	"context"
	"net/http"
)

type ScheduleService interface {
	GetMySchedules(userID uint) ([]model.Schedule, int, error)
	GetSchedules(userID uint) ([]model.Schedule, int, error)
	GetMyCoupleSchedules(userID uint) ([]model.Schedule, int, error)
	CreateSchedule(userID uint, createScheduleDTO dto.CreateScheduleDTO) (uint, int, error)
	DeleteSchedule(scheduleID uint, userID uint) (uint, int, error)
	UpdateSchedule(scheduleID uint, userID uint, updateScheduleDTO dto.UpdateScheduleDTO) (uint, int, error)
	GetScheduleByID(scheduleID uint) (model.Schedule, int, error)
	GetRedisSchedulesByCoupleID(userID uint) ([]model.Schedule, int, error)
	GetRedisRepeatSchedulesByCoupleID(userID uint) ([]model.Schedule, int, error)
}

type scheduleService struct {
	DB *gorm.DB
}

func NewScheduleService(db *gorm.DB) ScheduleService {
	return &scheduleService{
		DB: db,
	}
}

// 사용자가 작성한 캘린더을 조회
func (s *scheduleService) GetMySchedules(userID uint) ([]model.Schedule, int, error) {
	var schedules []model.Schedule

	if err := s.DB.Where("author_id = ?", userID).Find(&schedules).Error; err != nil {
		return nil, http.StatusInternalServerError, errors.ErrCannotFindSchedules
	}

	return schedules, http.StatusOK, nil
}

// 사용자와 사용자의 커플이 서로 작성한 캘린더을 조회
func (s *scheduleService) GetSchedules(userID uint) ([]model.Schedule, int, error) {
	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	var schedules []model.Schedule
	if err := s.DB.Where("couple_id = ?", couple.ID).Find(&schedules).Error; err != nil {
		return nil, http.StatusInternalServerError, errors.ErrCannotFindSchedules
	}

	return schedules, http.StatusOK, nil
}

// 사용자의 커플이 작성한 캘린더 조회
func (s *scheduleService) GetMyCoupleSchedules(userID uint) ([]model.Schedule, int, error) {
	user, err := model.FindUserByID(s.DB, userID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	if user.PartnerID == nil {
		return nil, http.StatusBadRequest, errors.ErrCannotFindCouple
	}

	var schedules []model.Schedule

	if err := s.DB.Where("author_id = ?", user.PartnerID).Find(&schedules).Error; err != nil {
		return nil, http.StatusInternalServerError, errors.ErrCannotFindSchedules
	}

	return schedules, http.StatusOK, nil
}

/* 캘린더/캘린더 추가 */
func (s *scheduleService) CreateSchedule(userID uint, createScheduleDTO dto.CreateScheduleDTO) (uint, int, error) {
	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return 0, http.StatusInternalServerError, err
	}

	var createdSchedule model.Schedule
	createdSchedule.CoupleID = couple.ID
	createdSchedule.AuthorID = userID

	createdSchedule.Title = createScheduleDTO.Title
	createdSchedule.Description = createScheduleDTO.Description
	createdSchedule.StartDate = createScheduleDTO.StartDate
	createdSchedule.EndDate = createScheduleDTO.EndDate
	createdSchedule.EventType = createScheduleDTO.EventType
	createdSchedule.RepeatType = createScheduleDTO.RepeatType
	createdSchedule.RepeatUntil = createScheduleDTO.RepeatUntil

	if err := createdSchedule.Save(s.DB); err != nil {
		return 0, http.StatusInternalServerError, err
	}

	return couple.ID, http.StatusCreated, nil
}

/* 캘린더 삭제
	* 캘린더에 있던 상세 일정도 삭제
*/
func (s *scheduleService) DeleteSchedule(scheduleID uint, userID uint) (uint, int, error) {
	schedule, err := model.FindScheduleByID(s.DB, scheduleID)
	if err != nil {
		return 0, http.StatusInternalServerError, errors.ErrCannotFindSchedule
	}

	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return 0, http.StatusInternalServerError, errors.ErrCannotFindCouple
	}

	if schedule.CoupleID != couple.ID {
		return 0, http.StatusForbidden, errors.ErrIsNotScheduleOwner
	}

	if err := schedule.Delete(s.DB); err != nil {
		return 0, http.StatusInternalServerError, errors.ErrCannotDeleteSchedule
	}

	return couple.ID, http.StatusOK, nil
}

func (s *scheduleService) UpdateSchedule(scheduleID uint, userID uint, updateScheduleDTO dto.UpdateScheduleDTO) (uint, int, error) {
	var schedule model.Schedule
	if err := s.DB.Where("id = ?", scheduleID).First(&schedule).Error; err != nil {
		return 0, http.StatusInternalServerError, errors.ErrCannotFindSchedule
	}

	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return 0, http.StatusInternalServerError, errors.ErrCannotFindCouple
	}

	if schedule.CoupleID != couple.ID {
		return 0, http.StatusForbidden, errors.ErrIsNotScheduleOwner
	}

	schedule.Title = updateScheduleDTO.Title
	schedule.Description = updateScheduleDTO.Description
	schedule.StartDate = updateScheduleDTO.StartDate
	schedule.EndDate = updateScheduleDTO.EndDate
	schedule.EventType = updateScheduleDTO.EventType
	schedule.RepeatType = updateScheduleDTO.RepeatType
	schedule.RepeatUntil = updateScheduleDTO.RepeatUntil

	// 1. 기존에 있던 상세 일정 업데이트
	if updateScheduleDTO.UpdateDetails != nil {
		for _, detail := range updateScheduleDTO.UpdateDetails {
			detail.ScheduleID = schedule.ID
			if err := model.UpdateScheduleDetail(s.DB, detail); err != nil {
				return 0, http.StatusInternalServerError, errors.ErrCannotUpdateScheduleDetail
			}
		}
	}

	// 2. 기존에 있던 상세 일정 삭제
	if updateScheduleDTO.DeleteDetails != nil {
		for _, detailID := range updateScheduleDTO.DeleteDetails {
			if err := model.DeleteScheduleDetail(s.DB, uint(detailID)); err != nil {
				return 0, http.StatusInternalServerError, errors.ErrCannotDeleteScheduleDetail
			}
		}
	}

	// 3. 새로운 상세 일정 추가
	if updateScheduleDTO.NewDetails != nil {
		for _, detail := range updateScheduleDTO.NewDetails {
			detail.ScheduleID = schedule.ID
			if err := detail.Save(s.DB); err != nil {
				return 0, http.StatusInternalServerError, errors.ErrCannotCreateScheduleDetail
			}
		}
	}

	if err := schedule.Save(s.DB); err != nil {
		return 0, http.StatusInternalServerError, errors.ErrCannotUpdateSchedule
	}

	return couple.ID, http.StatusOK, nil
}

/* 캘린더 ID로 캘린더 조회 */
func (s *scheduleService) GetScheduleByID(scheduleID uint) (model.Schedule, int, error) {
	schedule, err := model.FindScheduleByIDWithDetails(s.DB, scheduleID)
	if err != nil {
		return model.Schedule{}, http.StatusInternalServerError, errors.ErrCannotFindSchedule
	}

	return *schedule, http.StatusOK, nil
}

// 사용자와 커플의 일정을 Redis에서 조회
func (s *scheduleService) GetRedisSchedulesByCoupleID(userID uint) ([]model.Schedule, int, error) {
	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	schedules, err := redis.GetDailySchedulesByCoupleID(context.Background(), couple.ID)

	return schedules, http.StatusOK, nil
}

// 사용자와 커플의 반복 일정을 Redis에서 조회
func (s *scheduleService) GetRedisRepeatSchedulesByCoupleID(userID uint) ([]model.Schedule, int, error) {
	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	schedules, err := redis.GetDailyRepeatSchedulesByCoupleID(context.Background(), couple.ID)

	return schedules, http.StatusOK, nil
}
