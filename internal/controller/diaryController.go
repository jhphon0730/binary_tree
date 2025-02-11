package controller

import (
	"binary_tree/internal/controller/service"

	"github.com/gin-gonic/gin"
)

type DiaryController interface {
	CreateDiary(c *gin.Context)
}

type diaryController struct {
	diaryService service.DiaryService
}

func NewDiaryController(diaryService service.DiaryService) DiaryController {
	return &diaryController{
		diaryService: diaryService,
	}
}

func (d *diaryController) CreateDiary(c *gin.Context) {
	// userID := c.Param("userID")
}
