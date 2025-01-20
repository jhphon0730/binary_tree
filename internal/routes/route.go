package routes 

import (
	"github.com/gin-gonic/gin"
)

type Route struct {
	r *gin.Engine
}

func Init() *Route {
	r := gin.Default()
	return &Route{r}
}

// Register v1 routes
func registerV1Routes(router *gin.RouterGroup) {
    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })
}

// Register the routes
func (route *Route) RegisterRoutes() {
	// group v1
	v1 := route.r.Group("/v1")
	registerV1Routes(v1)
}

// setting the product mode 
func (route *Route) setProductMode() {
	gin.SetMode(gin.ReleaseMode)
} 

// Run Server 
func (route *Route) RunServer(port string, serverType string) {
	if serverType == "product" {
		route.setProductMode()
	}
	route.r.Run(port)
}

// Expose the Gin Engine
func (route *Route) Expose() *gin.Engine {
	return route.r
}
