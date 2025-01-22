package controller

import (
	"binary_tree/pkg/response"
	"binary_tree/internal/model/DTO"
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
	var user dto.UserSignUpDTO
	if err := c.ShouldBind(&user); err != nil {
		response.Error(c, 400, "모든 항목을 입력해주세요.")
		return
	}
	response.Created(c, user)
}

