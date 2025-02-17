package routes

import (
	"binary_tree/internal/controller"
	"binary_tree/internal/controller/service"
	"binary_tree/internal/database"
	"binary_tree/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"time"
	"net/http"
)

var (
	DB *gorm.DB = database.GetDB()

	userService   service.UserService   = service.NewUserService(DB)
	coupleService service.CoupleService = service.NewCoupleService(DB)
	diaryService service.DiaryService   = service.NewDiaryService(DB)
	

	userController   controller.UserController   = controller.NewUserController(userService, coupleService)
	coupleController controller.CoupleController = controller.NewCoupleController(coupleService)
	diaryController controller.DiaryController = controller.NewDiaryController(diaryService)
)

type Route struct {
	r *gin.Engine
}

func Init() *Route {
	r := gin.Default()

	// MEDIA
	r.Static("/media", "./media")

	// CORS 설정 개선
	r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://192.168.0.5:3000", "http://localhost:3000"}, // 실제 프론트엔드 주소
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true, // Credentials 허용
			AllowOriginFunc: func(origin string) bool {
					return true
			},
			MaxAge: 12 * time.Hour,
	}))

	// OPTIONS 요청 처리
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	return &Route{r}
}

// Register the routes
func (route *Route) RegisterRoutes() {
	user_router := route.r.Group("/users/")
	{
		registerUserRoutes(user_router)
	}

	couple_router := route.r.Group("/couples/")
	couple_router.Use(middleware.AuthMiddleware())
	{
		registerCoupleRoutes(couple_router)
	}

	diary_router := route.r.Group("/diaries/")
	diary_router.Use(middleware.AuthMiddleware())
	{
		registerDiaryRoutes(diary_router)
	}
}

// Run Server
func (route *Route) RunServer(port string, serverType string) {
	if serverType == "product" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}
	//:8080
	route.r.Run("0.0.0.0"+port)
}

// Expose the Gin Engine
func (route *Route) Expose() *gin.Engine {
	return route.r
}
