package routes

import (
	"binary_tree/internal/controller"

	"github.com/gin-gonic/gin"
)

/**
* DB : userRouter
* coupleService : userRouter
 */
var (
	coupleController controller.CoupleController = controller.NewCoupleController(coupleService)
)

func registerCoupleRoutes(router *gin.RouterGroup) {
	router.PUT("/", coupleController.UpdateSharedNote)
}
