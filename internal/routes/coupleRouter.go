package routes

import (
	"binary_tree/internal/controller"
	"binary_tree/internal/controller/service"
	"binary_tree/internal/database"

	"github.com/gin-gonic/gin"

	"gorm.io/gorm"
)

func registerCoupleRoutes(router *gin.RouterGroup) {
	var DB *gorm.DB = database.GetDB()

	var coupleService service.CoupleService = service.NewCoupleService(DB)

	var coupleController controller.CoupleController = controller.NewCoupleController(coupleService)

	router.PUT("/", coupleController.UpdateSharedNote)
}
