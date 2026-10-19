package main

import (
	"log"
	"net/http"

	"live-polling-app/database"
	"live-polling-app/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Connect to Databases
	if err := database.ConnectDB(); err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}
	defer database.CloseDB()

	// 2. Initialize Gin Router
	r := gin.Default()

	// 3. CORS Middleware for Gin
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})

	// 4. Register Routes
	// WebSocket endpoint
	r.GET("/ws", func(c *gin.Context) {
		handlers.WebSocketHandler(c.Writer, c.Request)
	})

	// Poll endpoints
	r.POST("/api/polls", func(c *gin.Context) {
		handlers.CreatePollHandler(c.Writer, c.Request)
	})

	r.GET("/api/polls/:id", func(c *gin.Context) {
		// Gin extracts the :id from the URL and puts it back so your existing handler can read it
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

	// Auth endpoints
	r.POST("/api/signup", func(c *gin.Context) {
		handlers.SignupHandler(c.Writer, c.Request)
	})

	r.POST("/api/login", func(c *gin.Context) {
		handlers.LoginHandler(c.Writer, c.Request)
	})

	// 5. Start Server
	log.Println("🚀 Server running on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
