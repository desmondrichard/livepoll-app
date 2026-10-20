package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoClient *mongo.Client
	RedisClient *redis.Client // ADDED: Redis client
	Ctx         = context.Background()
)

// ConnectDB connects to MongoDB and Redis.
func ConnectDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Connect to MongoDB
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		return fmt.Errorf("MONGO_URI environment variable is not set")
	}

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return fmt.Errorf("create MongoDB connection: %w", err)
	}

	if err := mongoClient.Ping(ctx, nil); err != nil {
		_ = mongoClient.Disconnect(context.Background())
		return fmt.Errorf("ping MongoDB: %w", err)
	}

	MongoClient = mongoClient

	// 2. Connect to Redis (Upstash)
	redisURL := os.Getenv("REDIS_URL")
	if redisURL != "" {
		opts, err := redis.ParseURL(redisURL)
		if err != nil {
			return fmt.Errorf("invalid REDIS_URL: %w", err)
		}
		
		redisClient := redis.NewClient(opts)
		
		if err := redisClient.Ping(ctx).Err(); err != nil {
			return fmt.Errorf("ping Redis: %w", err)
		}
		
		RedisClient = redisClient
	}

	return nil
}

// CloseDB closes the MongoDB and Redis connections.
func CloseDB() {
	if RedisClient != nil {
		_ = RedisClient.Close()
	}

	if MongoClient != nil {
		_ = MongoClient.Disconnect(context.Background())
	}
}