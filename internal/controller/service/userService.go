package service

import (
	"binary_tree/internal/config"
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"
	"binary_tree/internal/errors"
	"binary_tree/pkg/auth"
	"binary_tree/pkg/utils"

	"gorm.io/gorm"

	"math/rand"
	"time"
)

type UserService interface {
	CheckUserExists(username string) error

	// 사용자
	SignUpUser(userDTO dto.UserSignUpDTO) (model.User, error)
	SignInUser(userDTO dto.UserSignInDTO) (model.User, string, error)

	// 상대 사용자
	GenerateInviteCode(userID uint) (string, error)
}

type userService struct {
	DB *gorm.DB
}

func NewUserService(DB *gorm.DB) UserService {
	return &userService{
		DB: DB,
	}
}

// 사용자가 이미 존재하는지 확인
func (u *userService) CheckUserExists(username string) error {
	var count int64
	if err := u.DB.Model(&model.User{}).Where("username = ?", username).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return errors.ErrUsernameAlreadyExists
	}
	return nil
}

// 사용자 회원가입 / 등록
func (u *userService) SignUpUser(userDTO dto.UserSignUpDTO) (model.User, error) {
	user := model.User{
		Username: userDTO.Username,
		Name:     userDTO.Name,
		Email:    userDTO.Email,
		Password: userDTO.Password,
	}
	profilePath, err := utils.UploadProfileImage(userDTO.ProfileImageFile)
	if err != nil {
		return model.User{}, err
	}
	user.ProfileImageFile = profilePath

	if err := u.DB.Create(&user).Error; err != nil {
		return model.User{}, err
	}
	return user, nil
}

// 사용자 로그인
func (u *userService) SignInUser(userDTO dto.UserSignInDTO) (model.User, string, error) {
	var user model.User
	if err := u.DB.Where("username = ?", userDTO.Username).First(&user).Error; err != nil {
		return model.User{}, "", errors.ErrUserNotFound
	}
	if err := utils.ComparePassword(userDTO.Password, user.Password); err != nil {
		return model.User{}, "", err // invalid password
	}
	token, err := auth.GenerateJWT(int(user.ID))
	if err != nil {
		return model.User{}, "", errors.ErrInternalServer
	}
	return user, token, nil
}

// 초대 코드 생성
func (u *userService) GenerateInviteCode(userID uint) (string, error) {
	var existingInvite model.CoupleInvitation
	// 사용자가 보낸 초대 코드가 아직 처리되지 않았다면 기존 초대 코드를 반환
	if err := u.DB.Where("sender_id = ? AND status = 'pending'", userID).First(&existingInvite).Error; err == nil {
		return existingInvite.InviteCode, nil
	}

	rand.Seed(time.Now().UnixNano())
	charset := config.GetConfig().CHAR_SET
	code := make([]byte, 8)
	for i := range code {
		code[i] = charset[rand.Intn(len(charset))]
	}
	inviteCode := string(code)

	// 초대 코드 저장
	invitation := model.CoupleInvitation{
		SenderID:   userID,
		InviteCode: inviteCode,
		Status:     "pending",
	}
	if err := u.DB.Create(&invitation).Error; err != nil {
		return "", err
	}

	return inviteCode, nil
}
