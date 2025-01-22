package main

import (
	"binary_tree/internal/config"
	"binary_tree/internal/routes"
	"binary_tree/internal/database"

	"log"
)

func main() {
	// Config
	cfg := config.LoadConfig()
	// Server
	r := routes.Init();
	// database
	database.Init()
	database.MigrateDB() // migrate database
	defer database.CloseDB() // close database connection
	// Run server
	log.Printf("Starting server in %s mode on port %s", cfg.AppEnv, cfg.Port)
	r.RegisterRoutes()
	r.RunServer(cfg.Port, cfg.AppEnv)
}

