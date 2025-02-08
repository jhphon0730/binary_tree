package routes

import (
	"binary_tree/internal/middleware"

	"github.com/gin-gonic/gin"
)

func registerUserRoutes(router *gin.RouterGroup) {
	router.GET("/validate-token", middleware.AuthMiddleware(), userController.ValidateToken)

	router.POST("/sign-up", userController.SignUpUser)
	router.POST("/sign-in", userController.SignInUser)
	router.POST("/sign-out", middleware.AuthMiddleware(), userController.SignOutUser)

	router.POST("/invite-generate", middleware.AuthMiddleware(), userController.GenerateInviteCode)
	router.PUT("/invite-accept", middleware.AuthMiddleware(), userController.AcceptInvitation)
	router.GET("/invite-couple-status", middleware.AuthMiddleware(), userController.GetMyCoupleStatus)
	router.GET("/invite-couple-info", middleware.AuthMiddleware(), userController.GetMyCoupleInfo)
}
