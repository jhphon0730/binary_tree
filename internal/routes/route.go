package routes

import (
	"binary_tree/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Route struct {
	r *gin.Engine
}

func Init() *Route {
	r := gin.Default()

	// MEDIA
	r.Static("/media", "./media")

	// CORS
	// 3000 is the frontend port
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"*"},
	}))

	return &Route{r}
}

// Register the routes
func (route *Route) RegisterRoutes() {
	// ping
	route.r.GET("/ping", middleware.AuthMiddleware(), func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	user_router := route.r.Group("/users/")
	{
		registerUserRoutes(user_router)
	}
	couple_router := route.r.Group("/couples/")
	{
		couple_router.Use(middleware.AuthMiddleware())
		registerCoupleRoutes(couple_router)
	}
}

// Run Server
func (route *Route) RunServer(port string, serverType string) {
	if serverType == "product" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}
	route.r.Run(port)
}

// Expose the Gin Engine
func (route *Route) Expose() *gin.Engine {
	return route.r
}
