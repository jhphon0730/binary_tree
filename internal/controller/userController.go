package controller

import (
	"binary_tree/pkg/response"
	"binary_tree/internal/model"
	"binary_tree/internal/model/DTO"
	"binary_tree/internal/controller/service"

	"github.com/gin-gonic/gin"

	"net/http"
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
		response.Error(c, http.StatusBadRequest, model.ErrAllFieldsRequired.Error())
		return
	}
	if err := userDTO.Validate(); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	err := u.userService.CheckUserExists(userDTO.Username)
	if err != nil {
		if err == model.ErrUsernameAlreadyExists {
			response.Error(c, http.StatusConflict, err.Error())
			return
		}
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	createdUser, err := u.userService.SignUpUser(userDTO)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Created(c, createdUser)
	return
}

