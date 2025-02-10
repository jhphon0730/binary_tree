package controller

import (
	"binary_tree/internal/controller/service"
	"binary_tree/internal/errors"
	"binary_tree/internal/model/dto"
	"binary_tree/pkg/response"

	"github.com/gin-gonic/gin"

	"net/http"
)

type CoupleController interface {
	GetCoupleInfo(c *gin.Context)
	UpdateSharedNote(c *gin.Context)
	UpdateStartDate(c *gin.Context)
}

type coupleController struct {
	coupleService service.CoupleService
}

func NewCoupleController(coupleService service.CoupleService) CoupleController {
	return &coupleController{
		coupleService: coupleService,
	}
}

func (cc *coupleController) GetCoupleInfo(c *gin.Context) {
	userID := c.GetInt("userID")
	coupleInfo, err := cc.coupleService.GetCoupleInfo(uint(userID))
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, gin.H{ "coupleInfo": coupleInfo })
}

func (cc *coupleController) UpdateSharedNote(c *gin.Context) {
	var sharedNoteDTO dto.UpdateSharedNoteDTO
	if err := c.ShouldBindJSON(&sharedNoteDTO); err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrAllFieldsRequired.Error())
		return
	}

	userID := c.GetInt("userID")
	if err := cc.coupleService.UpdateSharedNote(uint(userID), sharedNoteDTO); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, nil)
}

func (cc *coupleController) UpdateStartDate(c *gin.Context) {
	var startDateDTO dto.UpdateStartDateDTO
	if err := c.ShouldBindJSON(&startDateDTO); err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrAllFieldsRequired.Error())
		return
	}

	userID := c.GetInt("userID")
	if err := cc.coupleService.UpdateStartDate(uint(userID), startDateDTO); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, nil)
}
