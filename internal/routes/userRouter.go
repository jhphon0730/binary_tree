package routes 

import (
	"github.com/gin-gonic/gin"
)

func registerUserRoutes(router *gin.RouterGroup) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "users",
		})
	})
	router.GET("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "user",
		})
	})
}
