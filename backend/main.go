package main

import (
	"log"
	"os"
	"time" // ADDED for CORS max age

	"github.com/joho/godotenv"

	"live-polling-app/database"
	"live-polling-app/handlers"

	"github.com/gin-contrib/cors" // ADDED official CORS package
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found (this is normal in production)")
	}

	// 2. Connect to Database
	if err := database.ConnectDB(); err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}
	defer database.CloseDB()

	// 3. Initialize Gin Router
	r := gin.Default()

	// 4. CORS Middleware (UPDATED with official package)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allows Vercel and localhost
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 5. Register Routes
	// WebSocket endpoint
	r.GET("/ws", func(c *gin.Context) {
		handlers.WebSocketHandler(c.Writer, c.Request)
	})

	// Poll endpoints
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

	// Auth endpoints
	r.POST("/api/signup", func(c *gin.Context) {
		handlers.SignupHandler(c.Writer, c.Request)
	})

	r.POST("/api/login", func(c *gin.Context) {
		handlers.LoginHandler(c.Writer, c.Request)
	})

	// 6. Start Server (UPDATED FOR RENDER)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Fallback for local development
	}

	log.Printf("🚀 Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
