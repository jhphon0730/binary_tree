package main

import (
	"binary_tree/internal/config"
	"binary_tree/internal/routes"
	"binary_tree/internal/database"

	"log"
)

func main() {
	// Server
	r := routes.Init();
	// Config
	cfg := config.LoadConfig()
	// database
	database.Init()

	// Run server
	log.Printf("Starting server in %s mode on port %s", cfg.AppEnv, cfg.Port)
	r.RegisterRoutes()
	r.RunServer(cfg.Port, cfg.AppEnv)
}

