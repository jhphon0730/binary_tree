package main

import (
	"binary_tree/pkg/utils"
	"binary_tree/pkg/redis"
	"binary_tree/internal/config"
	"binary_tree/internal/routes"
	"binary_tree/internal/database"

	"log"
)

func main() {
	// Config
	log.Println("Loading config...")
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %s", err)
	}

	// Server
	r := routes.Init()

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

	// redis
	log.Println("Initializing redis...")
	if err := redis.InitRedis(); err != nil {
		log.Fatalf("Error initializing redis: %s", err)
	}
	defer redis.CloseRedis() // close redis connection

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

