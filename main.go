package main

import (
	"binary_tree/internal/config"
	"binary_tree/internal/database"
	"binary_tree/internal/routes"
	"binary_tree/pkg/redis"
	"binary_tree/pkg/utils"

	"context"
	"log"
)

func main() {
	// Config
	log.Println("Loading config...")
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %s", err)
	}

	// database
	log.Println("Initializing database...")
	if err := database.InitDatabase(); err != nil {
		log.Fatalf("Error initializing database: %s", err)
	}
	log.Println("Migrating database...")
	if err := database.MigrateDB(); err != nil {
		log.Fatalf("Error migrating database: %s", err)
	}
	defer database.CloseDB() // close database connection

	// Server
	r := routes.Init()

	// redis
	ctx := context.Background()
	//// redis - user
	log.Println("Initializing User redis...")
	if err := redis.InitUserRedis(ctx); err != nil {
		log.Fatalf("Error initializing user redis: %s", err)
	}
	defer redis.CloseUserRedis()
	//// redis - couple invitation
	log.Println("Initializing Couple Inivitation redis...")
	if err := redis.InitCoupleInvitationRedis(ctx); err != nil {
		log.Fatalf("Error initializing couple invitation redis: %s", err)
	}
	defer redis.CloseCoupleInvitationRedis()
	//// redis - diary
	log.Println("Initializing Diary redis...")
	if err := redis.InitDiaryRedisInstance(ctx); err != nil {
		log.Fatalf("Error initializing diary redis: %s", err)
	}
	defer redis.CloseDiaryRedis()

	// Bcrypt
	log.Println("Initializing Bcrypt...")
	if err := utils.InitBcrypt(); err != nil {
		log.Fatalf("BCRYPT Setting Error: %s", err)
	}

	// Run server
	log.Printf("Starting server in %s mode on port %s", cfg.AppEnv, cfg.Port)
	r.RegisterRoutes()
	r.RunServer(cfg.Port, cfg.AppEnv)
}
