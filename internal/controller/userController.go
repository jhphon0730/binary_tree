package controller

import (
	"binary_tree/internal/controller/service"
	"binary_tree/internal/errors"
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/response"
	"binary_tree/pkg/utils"

	"github.com/gin-gonic/gin"

	"net/http"
)

type UserController interface {
	ValidateToken(c *gin.Context)

	SignUpUser(c *gin.Context)
	SignInUser(c *gin.Context)
	SignOutUser(c *gin.Context)

	GenerateInviteCode(c *gin.Context)
	AcceptInvitation(c *gin.Context)
	GetMyCoupleStatus(c *gin.Context)
	GetMyCoupleInfo(c *gin.Context)
}

type userController struct {
	userService   service.UserService
	coupleService service.CoupleService
}

func NewUserController(userService service.UserService, coupleService service.CoupleService) UserController {
	return &userController{
		userService:   userService,
		coupleService: coupleService,
	}
}

// 토큰이 유효한지 검증
func (u *userController) ValidateToken(c *gin.Context) {
	userID := c.GetInt("userID")
	response.Success(c, gin.H{"userID": userID})
	return
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
		response.Error(c, http.StatusConflict, err.Error())
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

	// 로그인 시에 커플 정보가 있다면 함께 가져옴
	partner := model.User{}
	if user.PartnerID != nil {
		partner, err = u.userService.GetMyCoupleInfo(user.ID)
		if err != nil {
			response.Error(c, http.StatusBadRequest, err.Error())
			return
		}
	}

	response.Success(c, gin.H{"user": user, "partner": partner, "token": token})
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

// 초대 코드 수락
func (u *userController) AcceptInvitation(c *gin.Context) {
	userID := c.GetInt("userID")
	inviteCode := c.Query("inviteCode")

	if inviteCode == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrInvalidInviteCode.Error())
		return
	}

	sender, receiver, err := u.userService.AcceptInvitation(inviteCode, uint(userID))
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	// 커플 생성
	err = u.coupleService.CreateCouple(sender.ID, receiver.ID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, nil)
}

// 현재 사용자가 커플이 있는 지 확인
func (u *userController) GetMyCoupleStatus(c *gin.Context) {
	userID := c.GetInt("userID")
	status, err := u.userService.GetMyCoupleStatus(uint(userID))
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, gin.H{"status": status})
}

// 현재 내 커플 정보 가져오기
func (u *userController) GetMyCoupleInfo(c *gin.Context) {
	userID := c.GetInt("userID")
	user, err := u.userService.GetMyCoupleInfo(uint(userID))
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, user)
}
