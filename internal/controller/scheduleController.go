package controller

import (
	"binary_tree/internal/model/dto"
	"binary_tree/internal/errors"
	"binary_tree/internal/controller/service"
	"binary_tree/pkg/response"

	"github.com/gin-gonic/gin"

	"strconv"
	"net/http"
)

type ScheduleController interface {
	GetMySchedules(c *gin.Context)
	GetSchedules(c *gin.Context)
	CreateSchedule(c *gin.Context)
}

type scheduleController struct {
	scheduleService service.ScheduleService
}

func NewScheduleController(scheduleService service.ScheduleService) ScheduleController {
	return &scheduleController{
		scheduleService: scheduleService,
	}
}

func (d *scheduleController) GetMySchedules(c *gin.Context) {
	userID := c.GetInt("userID")
	schedules, status, err := d.scheduleService.GetMySchedules(uint(userID))
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}
	response.Success(c, gin.H{"schedules": schedules})
}

func (d *scheduleController) GetSchedules(c *gin.Context) {
	coupleID_str, isValidCoupleID := c.GetQuery("coupleID")
	if !isValidCoupleID || coupleID_str == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindCoupleID.Error())
		return
	}
	coupleID, err := strconv.Atoi(coupleID_str)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, errors.ErrInvalidCoupleID.Error())
		return
	}

	schedules, status, err := d.scheduleService.GetSchedules(uint(coupleID))
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}
		response.Success(c, gin.H{"schedules": schedules})
}

func (d *scheduleController) CreateSchedule(c *gin.Context) {
	userID := c.GetInt("userID")
	var createScheduleDTO dto.CreateScheduleDTO
	if err := c.ShouldBindJSON(&createScheduleDTO); err != nil {
		response.Error(c, http.StatusInternalServerError, errors.ErrInvalidRequest.Error())
		return
	}

	status, err := d.scheduleService.CreateSchedule(uint(userID), createScheduleDTO)
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}
	response.Success(c, gin.H{"message": "일정이 추가되었습니다."})
}
