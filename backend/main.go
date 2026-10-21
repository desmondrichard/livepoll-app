package main

import (
	"log"
	"net/http"
	"os"

	"live-polling-app/database"
	"live-polling-app/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load .env file
	godotenv.Load()

	// 2. Connect to Database
	if err := database.ConnectDB(); err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}
	defer database.CloseDB()

	// 3. Initialize Gin Router
	r := gin.Default()

	// 4. BULLETPROOF CORS MIDDLEWARE
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Handle Preflight explicitly
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// 5. Register Routes
	r.GET("/ws", func(c *gin.Context) {
		handlers.WebSocketHandler(c.Writer, c.Request)
	})
	r.POST("/api/polls", func(c *gin.Context) {
		handlers.CreatePollHandler(c.Writer, c.Request)
	})
	r.GET("/api/polls/:id", func(c *gin.Context) {
		c.Request.URL.Path = "/api/polls/" + c.Param("id")
		handlers.GetPollHandler(c.Writer, c.Request)
	})
	r.GET("/api/all-polls", func(c *gin.Context) {
		handlers.GetAllPollsHandler(c.Writer, c.Request)
	})
	r.POST("/api/polls/reset/:id", func(c *gin.Context) {
		c.Request.URL.Path = "/api/polls/reset/" + c.Param("id")
		handlers.ResetPollHandler(c.Writer, c.Request)
	})
	r.POST("/api/signup", func(c *gin.Context) {
		handlers.SignupHandler(c.Writer, c.Request)
	})
	r.POST("/api/login", func(c *gin.Context) {
		handlers.LoginHandler(c.Writer, c.Request)
	})

	// 6. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
