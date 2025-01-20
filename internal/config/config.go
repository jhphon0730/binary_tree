package config

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv   string
	Port     string
}

var (
	configInstance *Config
	once           sync.Once
)

// LoadConfig initializes and loads the configuration from environment variables
func LoadConfig() (*Config) {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
		os.Exit(1)
	}

	return &Config{
		AppEnv:   getEnv("APP_ENV", "development"),
		Port:     getEnv("PORT", "8080"),
	}
}

// GetConfig provides access to the singleton Config instance
func GetConfig() *Config {
	once.Do(func() {
		configInstance = LoadConfig()
	})
	return configInstance
}

// getEnv fetches the value of an environment variable or returns a default value
func getEnv(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
