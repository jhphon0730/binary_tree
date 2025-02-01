package middleware

import (
	"binary_tree/pkg/auth"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/response"

	"github.com/gin-gonic/gin"

	"net/http"
	"strings"
)

// JWT 토큰을 확인하고 세션을 검증하는 미들웨어
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Authorization 헤더에서 토큰 확인
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, "유효하지 않은 요청입니다.")
			c.Abort()
			return
		}

		// Bearer 토큰에서 실제 토큰 추출
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// 토큰 검증 및 만료 확인과 클레임 추출
		claims, err := auth.ValidateAndParseJWT(tokenString)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "토큰이 유효하지 않습니다.")
			c.Abort()
			return
		}

		// JWT 토큰에서 userID 추출
		userID := claims.UserID

		// Redis에서 userID에 해당하는 로그인 세션이 존재하는지 확인
		token, err := redis.GetUserLoginSession(userID)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, "사용자를 인증할 수 없습니다.")
			c.Abort()
			return
		}
		if token != tokenString {
			response.Error(c, http.StatusUnauthorized, "로그인 세션이 만료되었습니다.")
			c.Abort()
			return
		}

		// 세션이 유효하면 userID를 컨텍스트에 설정
		c.Set("userID", userID)
		c.Set("token", tokenString)
		c.Next()
	}
}
