package routes

import (
	"github.com/gin-gonic/gin"
)

func registerDiaryRoutes(router *gin.RouterGroup) {
	router.GET("/all", diaryController.GetAllDiaries)
	router.POST("/new", diaryController.CreateDiary)
	router.GET("/latest", diaryController.GetLatestDiary)
}
