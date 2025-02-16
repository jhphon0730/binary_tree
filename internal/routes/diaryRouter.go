package routes

import (
	"github.com/gin-gonic/gin"
)

func registerDiaryRoutes(router *gin.RouterGroup) {
	router.GET("/detail", diaryController.GetDiaryWithImages)
	router.GET("/all", diaryController.GetAllDiaries)
	router.POST("/new", diaryController.CreateDiary)
	router.GET("/latest", diaryController.GetLatestDiary)
	router.PUT("/update", diaryController.UpdateDiary)
	router.DELETE("/delete", diaryController.DeleteDiary)
}
