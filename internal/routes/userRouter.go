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
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "users",
		})
	})
	router.GET("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "user",
		})
	})
}
