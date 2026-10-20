package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"os" // ADDED: For environment variables
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"live-polling-app/database"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Client struct {
	Conn *websocket.Conn
}

var (
	clients   = make(map[*Client]bool)
	clientsMu sync.Mutex
)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	client := &Client{Conn: conn}
	clientsMu.Lock()
	clients[client] = true
	clientsMu.Unlock()

	defer func() {
		clientsMu.Lock()
		delete(clients, client)
		clientsMu.Unlock()
	}()

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if messageType != websocket.TextMessage {
			continue
		}

		var voteData struct {
			Type     string `json:"type"`
			PollID   string `json:"pollId"`
			OptionID int    `json:"optionId"`
		}

		if err := json.Unmarshal(message, &voteData); err != nil {
			log.Printf("Invalid WebSocket message: %v", err)
			continue
		}

		if voteData.Type == "vote" {
			// REDIS: Check if they already voted (Rate Limiting)
			userIP := r.RemoteAddr
			redisKey := "voted:" + voteData.PollID + ":" + userIP

			isNewVote, err := database.RedisClient.SetNX(database.Ctx, redisKey, "true", 24*time.Hour).Result()
			if err != nil {
				log.Println("Redis Error:", err)
				continue
			}

			if !isNewVote {
				log.Println("User tried to double vote:", userIP)
				errorMsg, _ := json.Marshal(map[string]string{"error": "You have already voted!"})
				client.Conn.WriteMessage(websocket.TextMessage, errorMsg)
				continue
			}

			// REDIS: Count the vote LIVE
			voteCountKey := "poll:" + voteData.PollID
			optionIDStr := strconv.Itoa(voteData.OptionID)

			// Increment the vote count in Redis instantly
			newCount, err := database.RedisClient.HIncrBy(database.Ctx, voteCountKey, optionIDStr, 1).Result()
			if err != nil {
				log.Println("Redis Count Error:", err)
				continue
			}

			// MONGODB: Save the vote permanently
			objID, err := primitive.ObjectIDFromHex(voteData.PollID)
			if err == nil {
				// CHANGED: Use DB_NAME env variable here instead of hardcoded "livepoll"
				dbName := os.Getenv("DB_NAME")
				collection := database.MongoClient.Database(dbName).Collection("polls")

				filter := bson.M{"_id": objID}
				update := bson.M{
					"$inc": bson.M{"options.$[elem].votes": 1},
				}
				arrayFilters := options.ArrayFilters{
					Filters: []interface{}{bson.M{"elem.id": voteData.OptionID}},
				}
				opts := options.Update().SetArrayFilters(arrayFilters)

				_, err = collection.UpdateOne(database.Ctx, filter, update, opts)
				if err != nil {
					log.Println("MongoDB Update Error:", err)
				} else {
					log.Printf("✅ Vote saved to MongoDB for poll %s, option %d", voteData.PollID, voteData.OptionID)
				}
			}

			// BROADCAST: Tell everyone the new Redis count
			broadcastData := map[string]interface{}{
				"type":      "vote_update",
				"pollId":    voteData.PollID,
				"optionId":  voteData.OptionID,
				"voteCount": newCount, // Send the exact count from Redis
			}
			broadcastMsg, _ := json.Marshal(broadcastData)
			BroadcastMessage(broadcastMsg)
		}
	}
}

func BroadcastMessage(message []byte) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for client := range clients {
		if err := client.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Printf("WebSocket broadcast failed: %v", err)
			_ = client.Conn.Close()
			delete(clients, client)
		}
	}
}
