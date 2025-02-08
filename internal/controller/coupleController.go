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
	UpdateSharedNote(c *gin.Context)
}

type coupleController struct {
	coupleService service.CoupleService
}

func NewCoupleController(coupleService service.CoupleService) CoupleController {
	return &coupleController{
		coupleService: coupleService,
	}
}

func (cc *coupleController) UpdateSharedNote(c *gin.Context) {
	var sharedNoteDTO dto.UpdateSharedNoteDTO
	if err := c.ShouldBind(&sharedNoteDTO); err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrAllFieldsRequired.Error())
		return
	}
	if err := sharedNoteDTO.Validate(); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	userID := c.GetInt("userID")
	if err := cc.coupleService.UpdateSharedNote(uint(userID), sharedNoteDTO); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, nil)
}
