package routes

import (
	"github.com/gin-gonic/gin"
)

func registerScheduleRoutes(router *gin.RouterGroup) {
	router.GET("/", scheduleController.GetSchedules)
	router.POST("/", scheduleController.CreateSchedule)
	router.DELETE("/", scheduleController.DeleteSchedule)
	router.GET("/detail", scheduleController.GetScheduleByID)
	router.PUT("/", scheduleController.UpdateSchedule)

	router.GET("/redis", scheduleController.GetRedisSchedulesByCoupleID)
	router.GET("/redis/repeat", scheduleController.GetRedisRepeatSchedulesByCoupleID)
}
