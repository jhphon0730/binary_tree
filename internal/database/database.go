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
	once        sync.Once
)

// Init initializes the database connection
func InitDatabase() error {
	var err error
	cfg := config.GetConfig()
	dsn := "host=" + cfg.Postgres.DB_HOST + " user=" + cfg.Postgres.DB_USER + " password=" + cfg.Postgres.DB_PASSWORD + " dbname=" + cfg.Postgres.DB_NAME + " port=" + cfg.Postgres.DB_PORT + " sslmode=" + cfg.Postgres.SSL_MODE + " TimeZone=" + cfg.Postgres.TIMEZONE
	db_instance, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}
	return nil
}

// GetDB returns the singleton database instance
func GetDB() *gorm.DB {
	once.Do(func() {
		InitDatabase()
	})
	return db_instance
}

// CloseDB closes the database connection
func CloseDB() {
	db, err := db_instance.DB()
	if err != nil {
		log.Fatalf("Error closing database: %v", err)
	}
	db.Close()
}

// MigrateDB migrates the database schema
func MigrateDB() error {
	return db_instance.AutoMigrate(
		&model.User{}, &model.CoupleInvitation{},
	)
}
