package controller

import (
	"binary_tree/internal/errors"
	"binary_tree/internal/model/dto"
	"binary_tree/internal/controller/service"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/response"

	"github.com/gin-gonic/gin"

	"strconv"
	"net/http"
)

type DiaryController interface {
	GetAllDiaries(c *gin.Context)
	CreateDiary(c *gin.Context)
	GetLatestDiary(c *gin.Context)
}

type diaryController struct {
	diaryService service.DiaryService
}

func NewDiaryController(diaryService service.DiaryService) DiaryController {
	return &diaryController{
		diaryService: diaryService,
	}
}

func (d *diaryController) GetAllDiaries(c *gin.Context) {
	userID := c.GetInt("userID")
	category, isValidCategory := c.GetQuery("category")
	if !isValidCategory || category == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindCategory.Error())
		return
	}

	// 커플 아이디를 통해 다이어리 리스트 조회 "couple"
	// 내가 작성한 다이어리 리스트 조회 "my"
	// 커플이 서로 작성한 다이어리 리스트 조회 "all"
	switch category {
		case "my":
			diaries, status, err := d.diaryService.GetMyDiary(uint(userID))
			if err != nil {
				response.Error(c, status, err.Error())
				return
			}
			response.Success(c, gin.H{"diaries": diaries})
			return
		case "couple":
			diaries, status, err := d.diaryService.GetMyCoupleDiary(uint(userID))
			if err != nil {
				response.Error(c, status, err.Error())
			}
			response.Success(c, gin.H{"diaries": diaries})
			return

		case "all":
			diaries, status, err := d.diaryService.GetCoupleDiary(uint(userID))
			if err != nil {
				response.Error(c, status, err.Error())
				return
			}
			response.Success(c, gin.H{"diaries": diaries})
			return
	}

	response.Error(c, http.StatusBadRequest, errors.ErrInvalidCategory.Error())
	return
}

func (d *diaryController) CreateDiary(c *gin.Context) {
	userID := c.GetInt("userID")
	coupleID_str, isValidCoupleID := c.GetQuery("coupleID")
	if !isValidCoupleID || coupleID_str == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindCoupleID.Error())
		return
	}
	coupleID, err := strconv.Atoi(coupleID_str)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, errors.ErrInvalidCoupleID.Error())
		return
	}

	var createDiaryDTO dto.CreateDiaryDTO
	if err := c.ShouldBind(&createDiaryDTO); err != nil {
		response.Error(c, http.StatusBadRequest, errors.ErrAllFieldsRequired.Error())
		return
	}

	if err := createDiaryDTO.Validate(); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	created_diary, status, err := d.diaryService.CreateDiary(uint(userID), uint(coupleID), createDiaryDTO)
	if err != nil {
		response.Error(c, status, err.Error())
		return
	}

	_ = redis.SetLatestDiary(c, created_diary)
	
	response.Created(c, gin.H{"created_diary": created_diary})
}

// 최근 생성 된 다이어리 조회
func (d *diaryController) GetLatestDiary(c *gin.Context) {
	coupleID_str, isValidCoupleID := c.GetQuery("coupleID")
	if !isValidCoupleID || coupleID_str == "" {
		response.Error(c, http.StatusBadRequest, errors.ErrCannotFindCoupleID.Error())
		return
	}
	coupleID, err := strconv.Atoi(coupleID_str)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, errors.ErrInvalidCoupleID.Error())
		return
	}
	diary, err := redis.GetLatestDiary(c, uint(coupleID))
	if err != nil && err != errors.ErrDiaryNotFound {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return 
	}
	response.Success(c, gin.H{"latest_diary": diary})
}
