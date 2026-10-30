package postgres

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var pool *pgxpool.Pool

func InitPG() {

	pgURL := os.Getenv("POSTGRES_URL")
	if pgURL == "" {
		pgURL = "postgres://postgres:postgres@postgres:5432/graphqlastic?sslmode=disable"
	}
	var err error
	pool, err = pgxpool.New(context.Background(), pgURL)
	if err != nil {
		log.Fatalf("Error creating the postgres pool: %s", err)
	}
}

func GetPG() *pgxpool.Pool {
	return pool
}
