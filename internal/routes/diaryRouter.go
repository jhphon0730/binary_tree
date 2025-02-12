package routes

import (
	"github.com/gin-gonic/gin"
)

func registerDiaryRoutes(router *gin.RouterGroup) {
	router.POST("/new", diaryController.CreateDiary)
	router.GET("/latest", diaryController.GetLatestDiary)
}
