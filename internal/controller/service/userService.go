package service

import (
	"binary_tree/internal/config"
	"binary_tree/internal/errors"
	"binary_tree/internal/model"
	"binary_tree/internal/model/dto"
	"binary_tree/pkg/auth"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/utils"

	"gorm.io/gorm"

	"context"
	"math/rand"
	"time"
)

type UserService interface {
	CheckUserExists(username, email string) error

	// 사용자 기능
	SignUpUser(userDTO dto.UserSignUpDTO) (model.User, error)
	SignInUser(userDTO dto.UserSignInDTO) (model.User, string, error)

	// 상대 사용자와 관련 된 기능
	GenerateInviteCode(userID uint) (string, error)
	AcceptInvitation(inviteCode string, userID uint) (model.User, model.User, error)
	GetMyCoupleStatus(userID uint) (string, error)
	GetMyCoupleInfo(userID uint) (model.User, error)
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
func (u *userService) CheckUserExists(username, email string) error {
	_, err := model.FindUserByUsername(u.DB, username)
	if err == nil {
		return errors.ErrUsernameAlreadyExists
	}
	_, err = model.FindUserByEmail(u.DB, email)
	if err == nil {
		return errors.ErrEmailAlreadyExists
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
	if userDTO.ProfileImageFile != nil {
		profilePath, err := utils.UploadProfileImage(userDTO.ProfileImageFile)
		if err != nil {
			return model.User{}, err
		}
		user.ProfileImageFile = profilePath
	}
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
	// 기존에 생성된 초대 코드가 있는지 확인
	couple_invitation, err := redis.GetCoupleInvitation(context.Background(), int(userID))
	if err == nil {
		return couple_invitation.Code, nil
	}

	rand.Seed(time.Now().UnixNano())
	charset := config.GetConfig().CHAR_SET
	code := make([]byte, 8)
	for i := range code {
		code[i] = charset[rand.Intn(len(charset))]
	}
	inviteCode := string(code)

	err = redis.SetCoupleInvitation(context.Background(), int(userID), inviteCode)
	if err != nil {
		return "", errors.ErrFailedToSetRedis
	}
	err = redis.SetCoupleInvitationWithCode(context.Background(), inviteCode, int(userID))
	if err != nil {
		return "", errors.ErrFailedToSetRedis
	}

	return inviteCode, nil
}

// 초대 코드 수락
func (u *userService) AcceptInvitation(inviteCode string, userID uint) (model.User, model.User, error) {
	senderID, err := redis.GetCoupleInvitationWithCode(context.Background(), inviteCode)
	if senderID == 0 || err != nil {
		return model.User{}, model.User{}, errors.ErrInvalidInviteCode
	}

	// 초대코드를 입력한 사용자가 자기 자신의 초대 코드를 입력한 경우
	if senderID == int(userID) {
		return model.User{}, model.User{}, errors.ErrCannotInviteSelf
	}

	// 상대방 사용자 찾기 및 상대방 사용자가 이미 커플인지 확인
	sender, err := model.FindUserByID(u.DB, uint(senderID))
	if err != nil {
		return model.User{}, model.User{}, errors.ErrCannotFindInviteUser
	}
	if sender.PartnerID != nil {
		return model.User{}, model.User{}, errors.ErrAlreadyCouple
	}

	// 요청을 보낸 사용자 찾기 및 요청을 보낸 사용자가 이미 커플인지 확인
	receiver, err := model.FindUserByID(u.DB, userID)
	if err != nil {
		return model.User{}, model.User{}, errors.ErrCannotFindUser
	}
	if receiver.PartnerID != nil {
		return model.User{}, model.User{}, errors.ErrAlreadyCouple
	}

	// 커플 관계 설정
	u.DB.Model(&sender).Update("partner_id", receiver.ID)
	u.DB.Model(&receiver).Update("partner_id", sender.ID)

	// 커플 초대 코드 삭제
	redis.DeleteCoupleInvitation(context.Background(), int(senderID))
	redis.DeleteCoupleInvitation(context.Background(), int(receiver.ID))
	redis.DeleteCoupleInvitationWithCode(context.Background(), inviteCode)

	return sender, receiver, nil
}

// 현재 내 커플 정보 가져오기
func (u *userService) GetMyCoupleStatus(userID uint) (string, error) {
	user, err := model.FindUserByID(u.DB, userID)
	if err != nil {
		return "", errors.ErrCannotFindUser
	}

	if user.PartnerID == nil {
		return "single", nil
	}

	_, err = model.FindUserByID(u.DB, *user.PartnerID)
	if err != nil {
		return "", errors.ErrCannotFindPartner
	}
	return "coupled", nil
}

// 현재 내 커플 정보 가져오기
func (u *userService) GetMyCoupleInfo(userID uint) (model.User, error) {
	user, err := model.FindUserByID(u.DB, userID)
	if err != nil {
		return model.User{}, errors.ErrCannotFindUser
	}

	if user.PartnerID == nil {
		return model.User{}, errors.ErrNotCouple
	}

	partner, err := model.FindUserByID(u.DB, *user.PartnerID)
	if err != nil {
		return model.User{}, errors.ErrCannotFindPartner
	}
	return partner, nil
}
