package database

import (
	"binary_tree/internal/config"

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
func Init() *gorm.DB {
	log.Println("Connecting to database...")

	once.Do(func() {
		var err error
		cfg := config.GetConfig()
		dsn := "host=" + cfg.DB_HOST + " user=" + cfg.DB_USER + " password=" + cfg.DB_PASSWORD + " dbname=" + cfg.DB_NAME + " port=" + cfg.DB_PORT + " sslmode=" + cfg.SSL_MODE + " TimeZone=" + cfg.TIMEZONE
		db_instance, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Error connecting to database: %v", err)
		}
		log.Println("Database connection established!")
	})
	return db_instance
}

// GetDB returns the singleton database instance
func GetDB() *gorm.DB {
	return db_instance
}
