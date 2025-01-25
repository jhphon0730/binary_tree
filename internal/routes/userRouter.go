package routes

import (
	"binary_tree/internal/controller"
	"binary_tree/internal/controller/service"
	"binary_tree/internal/database"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB = database.GetDB()

	userService    service.UserService       = service.NewUserService(DB)
	userController controller.UserController = controller.NewUserController(userService)
)

func registerUserRoutes(router *gin.RouterGroup) {
	router.POST("/sign-up", userController.SignUpUser)
	router.POST("/sign-in", userController.SignInUser)
}
