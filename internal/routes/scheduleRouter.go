package routes

import (
	"github.com/gin-gonic/gin"
)

func registerScheduleRoutes(router *gin.RouterGroup) {
	router.GET("/", scheduleController.GetSchedules)
	router.POST("/", scheduleController.CreateSchedule)
}
