package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCoupleRoutes(router *gin.RouterGroup) {
	router.GET("/info", coupleController.GetCoupleInfo)
	router.PATCH("/info", coupleController.UpdateSharedNote)
}
