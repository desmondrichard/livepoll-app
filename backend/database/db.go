package database

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoClient *mongo.Client
	RedisClient *redis.Client
	Ctx         = context.Background()
)

// ConnectDB connects to MongoDB and Redis.
func ConnectDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return fmt.Errorf("create MongoDB connection: %w", err)
	}

	if err := mongoClient.Ping(ctx, nil); err != nil {
		_ = mongoClient.Disconnect(context.Background())
		return fmt.Errorf("ping MongoDB: %w", err)
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	if err := redisClient.Ping(ctx).Err(); err != nil {
		_ = redisClient.Close()
		_ = mongoClient.Disconnect(context.Background())
		return fmt.Errorf("ping Redis: %w", err)
	}

	MongoClient = mongoClient
	RedisClient = redisClient

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
