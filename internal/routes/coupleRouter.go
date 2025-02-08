package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCoupleRoutes(router *gin.RouterGroup) {
	router.PUT("/", coupleController.UpdateSharedNote)
}
