package main

import (
	"binary_tree/internal/routes"

	"log"
)

func main() {
	r := routes.Init();

	// Run the Development Server
	log.Println("Server is running on port 8080")
	r.RunDevelopmentServer(":8080")
}
