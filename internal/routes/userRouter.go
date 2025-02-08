package routes

import (
	"binary_tree/internal/controller"
	"binary_tree/internal/controller/service"
	"binary_tree/internal/database"
	"binary_tree/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func registerUserRoutes(router *gin.RouterGroup) {
	var DB *gorm.DB = database.GetDB()

	var coupleService service.CoupleService = service.NewCoupleService(DB)
	var userService service.UserService = service.NewUserService(DB)

	var userController controller.UserController = controller.NewUserController(userService, coupleService)

	router.GET("/validate-token", middleware.AuthMiddleware(), userController.ValidateToken)

	router.POST("/sign-up", userController.SignUpUser)
	router.POST("/sign-in", userController.SignInUser)
	router.POST("/sign-out", middleware.AuthMiddleware(), userController.SignOutUser)

	router.POST("/invite-generate", middleware.AuthMiddleware(), userController.GenerateInviteCode)
	router.PUT("/invite-accept", middleware.AuthMiddleware(), userController.AcceptInvitation)
	router.GET("/invite-couple-status", middleware.AuthMiddleware(), userController.GetMyCoupleStatus)
	router.GET("/invite-couple-info", middleware.AuthMiddleware(), userController.GetMyCoupleInfo)
}
