package main

import (
	"binary_tree/internal/config"
	"binary_tree/internal/routes"

	"log"
)

func main() {
	// Server
	r := routes.Init();
	// Config
	cfg := config.LoadConfig()

	// Run server
	log.Printf("Starting server in %s mode on port %s", cfg.AppEnv, cfg.Port)
	r.RegisterRoutes()
	r.RunServer(cfg.Port, cfg.AppEnv)
}

