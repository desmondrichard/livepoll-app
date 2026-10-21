package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"live-polling-app/database"
	"live-polling-app/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreatePollHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var poll models.Poll
	if err := json.NewDecoder(r.Body).Decode(&poll); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	//  SERVER-SIDE VALIDATION
	if len(strings.TrimSpace(poll.Question)) < 5 {
		http.Error(w, "Question must be at least 5 characters long", http.StatusBadRequest)
		return
	}

	if len(poll.Options) < 2 {
		http.Error(w, "At least 2 options are required", http.StatusBadRequest)
		return
	}

	for _, opt := range poll.Options {
		if len(strings.TrimSpace(opt.Text)) == 0 {
			http.Error(w, "Options cannot be empty", http.StatusBadRequest)
			return
		}
	}
	//  END OF VALIDATION

	poll.Status = "active"
	for i := range poll.Options {
		poll.Options[i].Votes = 0
	}

	// CHANGED: Uses DB_NAME env variable
	dbName := os.Getenv("DB_NAME")
	collection := database.MongoClient.Database(dbName).Collection("polls")
	result, err := collection.InsertOne(database.Ctx, poll)
	if err != nil {
		http.Error(w, "Failed to save poll", http.StatusInternalServerError)
		return
	}

	poll.ID = result.InsertedID.(primitive.ObjectID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(poll)
}

func GetPollHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Get the ID from the URL
	pollID := r.URL.Path[len("/api/polls/"):]

	// 2. Convert to MongoDB ID
	objID, err := primitive.ObjectIDFromHex(pollID)
	if err != nil {
		http.Error(w, "Invalid Poll ID", http.StatusBadRequest)
		return
	}

	// 3. Find it in MongoDB
	// CHANGED: Uses DB_NAME env variable
	dbName := os.Getenv("DB_NAME")
	collection := database.MongoClient.Database(dbName).Collection("polls")
	var poll models.Poll
	err = collection.FindOne(database.Ctx, bson.M{"_id": objID}).Decode(&poll)
	if err != nil {
		http.Error(w, "Poll not found", http.StatusNotFound)
		return
	}

	// 4. Send it back
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(poll)
}

func GetAllPollsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// CHANGED: Uses DB_NAME env variable
	dbName := os.Getenv("DB_NAME")
	collection := database.MongoClient.Database(dbName).Collection("polls")
	filter := bson.M{"creatorId": userID}
	cursor, err := collection.Find(database.Ctx, filter)
	if err != nil {
		http.Error(w, "Failed to fetch polls", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(database.Ctx)

	var polls []models.Poll
	if err = cursor.All(database.Ctx, &polls); err != nil {
		http.Error(w, "Failed to decode polls", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(polls)
}

func ResetPollHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pollID := r.URL.Path[len("/api/polls/reset/"):]
	objID, err := primitive.ObjectIDFromHex(pollID)
	if err != nil {
		http.Error(w, "Invalid Poll ID", http.StatusBadRequest)
		return
	}

	// CHANGED: Uses DB_NAME env variable
	dbName := os.Getenv("DB_NAME")
	collection := database.MongoClient.Database(dbName).Collection("polls")

	update := bson.M{
		"$set": bson.M{"options.$[].votes": 0},
	}

	_, err = collection.UpdateOne(database.Ctx, bson.M{"_id": objID}, update)
	if err != nil {
		http.Error(w, "Failed to reset poll", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Poll reset successfully"}`))
}
