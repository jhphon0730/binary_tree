package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCoupleRoutes(router *gin.RouterGroup) {
	router.GET("/", coupleController.GetCoupleInfo)
	router.PATCH("/shared-note", coupleController.UpdateSharedNote)
	router.PATCH("/start-date", coupleController.UpdateStartDate)
}
