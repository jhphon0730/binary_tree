package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCoupleRoutes(router *gin.RouterGroup) {
	router.GET("/info", coupleController.GetCoupleInfo)
	router.PATCH("/info/shared-note", coupleController.UpdateSharedNote)
	router.PATCH("/info/start-date", coupleController.UpdateStartDate)
}
