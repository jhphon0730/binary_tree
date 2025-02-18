package routes

import (
	"github.com/gin-gonic/gin"
)

func registerDiaryRoutes(router *gin.RouterGroup) {
	router.GET("/", diaryController.GetAllDiaries)
	router.POST("/", diaryController.CreateDiary)
	router.PUT("/", diaryController.UpdateDiary)
	router.DELETE("/", diaryController.DeleteDiary)
	router.GET("/latest", diaryController.GetLatestDiary)
	router.GET("/detail", diaryController.GetDiaryWithImages)

	router.GET("/search/t", diaryController.SearchDiaryByTitle) // t for title
	router.GET("/search/c", diaryController.SearchDiaryByContent) // c for content
	router.GET("/search/d", diaryController.SearchDiaryByDiaryDate) // d for diary date (diary_date)
}
