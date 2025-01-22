package controller

import (
	"binary_tree/internal/controller/service"

	"github.com/gin-gonic/gin"
)

type UserController interface {
	SignUpUser(c *gin.Context)
}

type userController struct {
	userService service.UserService
}

func NewUserController(userService service.UserService) UserController {
	return &userController{userService: userService}
}

func (u *userController) SignUpUser(c *gin.Context) {
	// do something...
	// u.userService.SignUpUser()
}

