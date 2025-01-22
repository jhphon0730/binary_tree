package database

import (
	"binary_tree/internal/config"
	"binary_tree/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"log"
	"sync"
)

var (
	db_instance *gorm.DB
	once sync.Once
)

// Init initializes the database connection
func Init() {
	log.Println("Connecting to database...")

	var err error
	cfg := config.GetConfig()
	dsn := "host=" + cfg.DB_HOST + " user=" + cfg.DB_USER + " password=" + cfg.DB_PASSWORD + " dbname=" + cfg.DB_NAME + " port=" + cfg.DB_PORT + " sslmode=" + cfg.SSL_MODE + " TimeZone=" + cfg.TIMEZONE
	db_instance, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	log.Println("Database connection established!")
}

// GetDB returns the singleton database instance
func GetDB() *gorm.DB {
	once.Do(func() {
		Init()
	})
	return db_instance
}

// CloseDB closes the database connection
func CloseDB() {
	log.Println("Closing database connection...")
	db, err := db_instance.DB()
	if err != nil {
		log.Fatalf("Error closing database: %v", err)
	}
	db.Close()
	log.Println("Database connection closed!")
}

// MigrateDB migrates the database schema
func MigrateDB() {
	log.Println("Migrating database schema...")
	db_instance.AutoMigrate(&model.User{})
	log.Println("Database schema migrated!")
}
