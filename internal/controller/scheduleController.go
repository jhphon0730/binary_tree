package controller

import (
	"binary_tree/internal/model/dto"
	"binary_tree/internal/errors"
	"binary_tree/internal/controller/service"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/response"

	"github.com/gin-gonic/gin"

	"strconv"
	"net/http"
)

type ScheduleController interface {
	GetSchedules(c *gin.Context)
	CreateSchedule(c *gin.Context)
	DeleteSchedule(c *gin.Context)
	GetScheduleByID(c *gin.Context)

	GetRedisSchedulesByCoupleID(c *gin.Context)
	GetRedisRepeatSchedulesByCoupleID(c *gin.Context)
}

type scheduleController struct {
	scheduleService service.ScheduleService
}

func NewScheduleController(scheduleService service.ScheduleService) ScheduleController {
	return &scheduleController{
		scheduleService: scheduleService,
	}
}

func (d *scheduleController) GetSchedules(c *gin.Context) {
	userID := c.GetInt("userID")
	category, isValidCategory := c.GetQuery("category")
	if !isValidCategory || category == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindCategory.Error())
		return
	}

	switch category {
		case "my":
			schedules, status, err := d.scheduleService.GetMySchedules(uint(userID))
			if err != nil {
				response.Error(c, status, err.Error())
				return
			}
			response.Success(c, gin.H{"schedules": schedules})
		case "couple":
			schedules, status, err := d.scheduleService.GetMyCoupleSchedules(uint(userID))
			if err != nil {
				response.Error(c, status, err.Error())
				return
			}
			response.Success(c, gin.H{"schedules": schedules})
		case "all":
			schedules, status, err := d.scheduleService.GetSchedules(uint(userID))
			if err != nil {
				response.Error(c, status, err.Error())
				return
			}
			response.Success(c, gin.H{"schedules": schedules})
		default:
			response.Error(c, http.StatusBadRequest, errors.ErrCannotFindCategory.Error())
			return
	}
}

func (d *scheduleController) CreateSchedule(c *gin.Context) {
	userID := c.GetInt("userID")
	var createScheduleDTO dto.CreateScheduleDTO
	if err := c.ShouldBindJSON(&createScheduleDTO); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	coupleID, status, err := d.scheduleService.CreateSchedule(uint(userID), createScheduleDTO)
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}

	err = redis.RunDailyScheduleUpdateByCoupleID(c, coupleID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, gin.H{"message": "일정이 추가되었습니다."})
}

func (d *scheduleController) DeleteSchedule(c *gin.Context) {
	userID := c.GetInt("userID")
	scheduleIDStr, isValidScheduleIDStr := c.GetQuery("scheduleID")
	if !isValidScheduleIDStr || scheduleIDStr == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindScheduleID.Error())
		return
	}

	scheduleID, err := strconv.Atoi(scheduleIDStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindScheduleID.Error())
		return
	}

	coupleID, status, err := d.scheduleService.DeleteSchedule(uint(scheduleID), uint(userID))
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}

	err = redis.RunDailyScheduleUpdateByCoupleID(c, coupleID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, gin.H{"message": "일정이 삭제되었습니다."})
}

func (d *scheduleController) GetScheduleByID(c *gin.Context) {
	scheduleIDStr, isValidScheduleIDStr := c.GetQuery("scheduleID")
	if !isValidScheduleIDStr || scheduleIDStr == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindScheduleID.Error())
		return
	}

	scheduleID, err := strconv.Atoi(scheduleIDStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindScheduleID.Error())
		return
	}

	schedule, status, err := d.scheduleService.GetScheduleByID(uint(scheduleID))
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}

	response.Success(c, gin.H{"schedule": schedule})
}

func (d *scheduleController) GetRedisSchedulesByCoupleID(c *gin.Context) {
	userID := c.GetInt("userID")

	schedules, status, err := d.scheduleService.GetRedisSchedulesByCoupleID(uint(userID))
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}

	response.Success(c, gin.H{"schedules": schedules})
}

func (d *scheduleController) GetRedisRepeatSchedulesByCoupleID(c *gin.Context) {
	userID := c.GetInt("userID")

	schedules, status, err := d.scheduleService.GetRedisRepeatSchedulesByCoupleID(uint(userID))
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}

	response.Success(c, gin.H{"schedules": schedules})
}
