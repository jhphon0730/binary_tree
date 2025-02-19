package service

import (
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"
	"binary_tree/internal/errors"

	"gorm.io/gorm"

	"net/http"
)

type ScheduleService interface {
	GetMySchedules(userID uint) ([]model.Schedule, int, error)
	GetSchedules(coupleID uint) ([]model.Schedule, int, error)
	CreateSchedule(userID uint, createScheduleDTO dto.CreateScheduleDTO) (int, error)
}

type scheduleService struct {
	DB *gorm.DB
}

func NewScheduleService(db *gorm.DB) ScheduleService {
	return &scheduleService{
		DB: db,
	}
}

// 사용자가 작성한 일정을 조회
func (s *scheduleService) GetMySchedules(userID uint) ([]model.Schedule, int, error) {
	var schedules []model.Schedule

	if err := s.DB.Where("author_id = ?", userID).Find(&schedules).Error; err != nil {
		return nil, http.StatusInternalServerError, errors.ErrCannotFindSchedules
	}

	return schedules, http.StatusOK, nil
}

// 사용자와 사용자의 커플이 서로 작성한 일정을 조회
func (s *scheduleService) GetSchedules(coupleID uint) ([]model.Schedule, int, error) {
	var schedules []model.Schedule

	if err := s.DB.Where("couple_id = ?", coupleID).Find(&schedules).Error; err != nil {
		return nil, http.StatusInternalServerError, errors.ErrCannotFindSchedules
	}

	return schedules, http.StatusOK, nil
}

/* 캘린더/일정 추가 */
func (s *scheduleService) CreateSchedule(userID uint, createScheduleDTO dto.CreateScheduleDTO) (int, error) {
	couple, err := model.GetCoupleByUserID(s.DB, userID)
	if err != nil {
		return http.StatusInternalServerError, err
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

	if err := createdSchedule.Save(s.DB); err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusCreated, nil
}
