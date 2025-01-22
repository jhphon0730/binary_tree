package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// 표준 응답 구조 
// Message : "Success" or "Error"
// Data : 응답 데이터
// Error : 오류 메시지
// 프론트에서 응답 성공 유무는 STATUS CODE로 판단 가능
type StandardResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// Success는 성공적인 응답을 반환합니다.
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, StandardResponse{
		Message: "Success",
		Data:    data,
	})
}

// Error는 오류 응답을 반환합니다.
func Error(c *gin.Context, statusCode int, errMsg string) {
	c.JSON(statusCode, StandardResponse{
		Message: "Error",
		Error:   errMsg,
	})
}

// Created는 데이터 생성 후 성공 응답을 반환합니다.
func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, StandardResponse{
		Message: "Created",
		Data:    data,
	})
}

// NoContent는 데이터가 없을 때의 응답 (204 No Content)
func NoContent(c *gin.Context) {
	c.JSON(http.StatusNoContent, nil)
}
