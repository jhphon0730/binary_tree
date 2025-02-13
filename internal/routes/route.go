package routes

import (
	"binary_tree/internal/controller"
	"binary_tree/internal/controller/service"
	"binary_tree/internal/database"
	"binary_tree/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

	// CORS
	// 3000 is the frontend port
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"*"},
	}))

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
	route.r.Run(port)
}

// Expose the Gin Engine
func (route *Route) Expose() *gin.Engine {
	return route.r
}
