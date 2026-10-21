// main.go
package main

import (
	"log"
	"net/http" // ADDED for OPTIONS bypass
	"os"
	"time"

	"github.com/joho/godotenv"

	"live-polling-app/database"
	"live-polling-app/handlers"

	"github.com/gin-contrib/cors"
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

	// 4. CORS Middleware (FIXED)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // 👈 MUST BE FALSE when using "*"
		MaxAge:           12 * time.Hour,
	}))

	// 4.5 Handle OPTIONS requests cleanly
	r.OPTIONS("/*any", func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNoContent)
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
