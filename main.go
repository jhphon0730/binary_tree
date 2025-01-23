package main

import (
	"binary_tree/internal/config"
	"binary_tree/internal/routes"
	"binary_tree/internal/database"
	"binary_tree/pkg/utils"

	"log"
)

func main() {
	// Config
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %s", err)
	}

	// Server
	r := routes.Init()

	// database
	if err := database.Init(); err != nil {
		log.Fatalf("Error initializing database: %s", err)
	}
	if err := database.MigrateDB(); err != nil {
		log.Fatalf("Error migrating database: %s", err)
	}
	defer database.CloseDB() // close database connection

	// Bcrypt
	if err := utils.InitBcrypt(); err != nil {
		log.Fatalf("BCRYPT Setting Error: %s", err)
	}

	// Run server
	log.Printf("Starting server in %s mode on port %s", cfg.AppEnv, cfg.Port)
	r.RegisterRoutes()
	r.RunServer(cfg.Port, cfg.AppEnv)
}

