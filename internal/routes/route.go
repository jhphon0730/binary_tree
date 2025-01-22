package routes 

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

type Route struct {
	r *gin.Engine
}

func Init() *Route {
	r := gin.Default()

	// CORS
	r.Use(cors.Default())

	return &Route{r}
}

// Register the routes
func (route *Route) RegisterRoutes() {
	user_router := route.r.Group("/users")
	{
		registerUserRoutes(user_router)
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
