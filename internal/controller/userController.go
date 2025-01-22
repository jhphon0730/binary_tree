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
	var userDTO dto.UserSignUpDTO
	if err := c.ShouldBind(&userDTO); err != nil {
		response.Error(c, 400, "모든 항목을 입력해주세요.")
		return
	}
	if err := userDTO.Validate(); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	// TODO : 비밀번호 암호화
	createdUser, err := u.userService.SignUpUser(userDTO)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Created(c, createdUser)
	return
}

