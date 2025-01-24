package controller

import (
	"binary_tree/pkg/utils"
	"binary_tree/pkg/response"
	"binary_tree/internal/model"
	"binary_tree/internal/model/DTO"
	"binary_tree/internal/controller/service"

	"github.com/gin-gonic/gin"

	"net/http"

	// TEST
	"binary_tree/pkg/redis"
)

type UserController interface {
	SignUpUser(c *gin.Context)
	SignInUser(c *gin.Context)
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
	userID := 1
	key, err := utils.GenerateJWT(userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	bool, err := utils.ValidateJWT(key)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	if !bool {
		response.Error(c, http.StatusInternalServerError, "토큰 검증 실패")
		return
	} 

	check, err := utils.ParseJWT(key)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	if err := redis.SetUserLoginSession(check.UserID, key); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	testA, err := redis.GetUserLoginSession(check.UserID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "세션 정보 저장 실패")
		return
	}

	response.Success(c, gin.H{
		"token": key,
		"session": testA,
	})
}
