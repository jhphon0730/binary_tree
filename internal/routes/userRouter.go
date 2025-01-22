package routes 

import (
	"binary_tree/internal/database"
	"binary_tree/internal/controller"
	"binary_tree/internal/controller/service"

	"github.com/gin-gonic/gin"
)

var (
	userService service.UserService = service.NewUserService(database.GetDB())
	userController controller.UserController = controller.NewUserController(userService)
)

func registerUserRoutes(router *gin.RouterGroup) {
	router.POST("/", userController.SignUpUser)
}
