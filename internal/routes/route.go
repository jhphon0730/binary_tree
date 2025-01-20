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

// setting the product mode 
func (route *Route) setProductMode() {
	gin.SetMode(gin.ReleaseMode)
} 

// Run the Product Server
func (route *Route) RunProductServer(port string) {
	route.setProductMode()

	route.r.Run(port)
}

// Run the Development Server
func (route *Route) RunDevelopmentServer(port string) {
	route.r.Run(port)
}

// Expose the Gin Engine
func (route *Route) Expose() *gin.Engine {
	return route.r
}
