package database

import (
	"binary_tree/internal/config"

	"gorm.io/gorm"
	"gorm.io/driver/postgres"

	"log"
	"sync"
)

var (
	db *gorm.DB
	once sync.Once
)

func Init() *gorm.DB {
	log.Println("Connecting to database...")

	once.Do(func() {
		var err error
		cfg := config.GetConfig()
		dsn := "host=" + cfg.DB_HOST + " user=" + cfg.DB_USER + " password=" + cfg.DB_PASSWORD + " dbname=" + cfg.DB_NAME + " port=" + cfg.DB_PORT + " sslmode=" + cfg.SSL_MODE + " TimeZone=" + cfg.TIMEZONE
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Error connecting to database: %v", err)
		}
	})
	return db
}

func GetDB() *gorm.DB {
	return db
}
