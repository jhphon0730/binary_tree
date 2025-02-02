package controller

import (
	"binary_tree/internal/model/dto"
	"binary_tree/internal/errors"
	"binary_tree/internal/controller/service"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/response"
	"binary_tree/pkg/utils"

	"github.com/gin-gonic/gin"

	"net/http"
)

type UserController interface {
	SignUpUser(c *gin.Context)
	SignInUser(c *gin.Context)
	SignOutUser(c *gin.Context)
	GenerateInviteCode(c *gin.Context)
}

type userController struct {
	userService service.UserService
}

func NewUserController(userService service.UserService) UserController {
	return &userController{userService: userService}
}

// 사용자 회원가입 / 등록
func (u *userController) SignUpUser(c *gin.Context) {
	var userDTO dto.UserSignUpDTO
	if err := c.ShouldBind(&userDTO); err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrAllFieldsRequired.Error())
		return
	}
	if err := userDTO.Validate(); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	err := u.userService.CheckUserExists(userDTO.Username, userDTO.Email)
	if err != nil {
		if err == errors.ErrUsernameAlreadyExists {
			response.Error(c, http.StatusConflict, err.Error())
			return
		}
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	userDTO.Password, err = utils.EncryptPassword(userDTO.Password)
	if err != nil {
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

// 사용자 로그인
func (u *userController) SignInUser(c *gin.Context) {
	var userDTO dto.UserSignInDTO
	if err := c.ShouldBindJSON(&userDTO); err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrAllFieldsRequired.Error())
		return
	}

	user, token, err := u.userService.SignInUser(userDTO)
	if err != nil {
		if err == errors.ErrUserNotFound || err == errors.ErrInvalidPassword {
			response.Error(c, http.StatusUnauthorized, err.Error())
			return
		}
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	if err := redis.SetUserLoginSession(c, int(user.ID), token); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, gin.H{"user": user, "token": token})
	return
}

// 사용자 로그아웃
func (u *userController) SignOutUser(c *gin.Context) {
	userID := c.GetInt("userID")
	if err := redis.DeleteUserLoginSession(c, userID); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, nil)
	return
}

// 초대 코드 생성
func (u *userController) GenerateInviteCode(c *gin.Context) {
	userID := c.GetInt("userID")
	inviteCode, err := u.userService.GenerateInviteCode(uint(userID))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, gin.H{"inviteCode": inviteCode})
	return
}
