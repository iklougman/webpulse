package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

type Site struct {
	ID            int64  `json:"id"`
	Name          string `json:"name"`
	URL           string `json:"url"`
	CheckInterval int    `json:"checkInterval"`
	Timeout       int    `json:"timeout"`
	Enabled       bool   `json:"enabled"`
	UserID        string `json:"userId"`
}

type CheckJob struct {
	SiteID  int64  `json:"siteId"`
	UserID  string `json:"userId"`
	URL     string `json:"url"`
	Timeout int    `json:"timeout"`
}

type Scheduler struct {
	redisClient *redis.Client
	ctx         context.Context
	logger      *logrus.Logger
}

func NewScheduler() *Scheduler {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize logger
	logger := logrus.New()
	logger.SetLevel(logrus.InfoLevel)

	// Initialize Redis client
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		logger.Fatalf("Failed to parse Redis URL: %v", err)
	}

	redisClient := redis.NewClient(opt)

	// Test Redis connection
	ctx := context.Background()
	_, err = redisClient.Ping(ctx).Result()
	if err != nil {
		logger.Fatalf("Failed to connect to Redis: %v", err)
	}

	logger.Info("Connected to Redis successfully")

	return &Scheduler{
		redisClient: redisClient,
		ctx:         ctx,
		logger:      logger,
	}
}

func (s *Scheduler) Start() {
	s.logger.Info("Starting scheduler...")

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	// Initial run
	s.processDueChecks()

	// Schedule regular runs
	for range ticker.C {
		s.processDueChecks()
	}
}

func (s *Scheduler) processDueChecks() {
	s.logger.Info("Processing due checks...")

	// Get current timestamp
	now := time.Now().Unix()

	// Get all sites from Redis
	sites, err := s.getAllSites()
	if err != nil {
		s.logger.Errorf("Failed to get sites: %v", err)
		return
	}

	// Process each site
	for _, site := range sites {
		if !site.Enabled {
			continue
		}

		// Check if it's time for this site to be checked
		lastCheckKey := fmt.Sprintf("last_check:%d", site.ID)
		lastCheckStr, err := s.redisClient.Get(s.ctx, lastCheckKey).Result()

		var lastCheck int64
		if err == redis.Nil {
			// First check
			lastCheck = 0
		} else if err != nil {
			s.logger.Errorf("Failed to get last check time for site %d: %v", site.ID, err)
			continue
		} else {
			lastCheck, err = strconv.ParseInt(lastCheckStr, 10, 64)
			if err != nil {
				s.logger.Errorf("Failed to parse last check time: %v", err)
				continue
			}
		}

		// Check if enough time has passed
		if now-lastCheck >= int64(site.CheckInterval) {
			s.scheduleCheck(site)

			// Update last check time
			err = s.redisClient.Set(s.ctx, lastCheckKey, now, 0).Err()
			if err != nil {
				s.logger.Errorf("Failed to update last check time: %v", err)
			}
		}
	}
}

func (s *Scheduler) getAllSites() ([]Site, error) {
	// In a real implementation, this would fetch from the database
	// For now, we'll simulate with some test data
	sites := []Site{
		{
			ID:            1,
			Name:          "Example Site",
			URL:           "https://example.com",
			CheckInterval: 300, // 5 minutes
			Timeout:       10,
			Enabled:       true,
			UserID:        "user123",
		},
		{
			ID:            2,
			Name:          "Test Site",
			URL:           "https://httpbin.org/status/200",
			CheckInterval: 180, // 3 minutes
			Timeout:       5,
			Enabled:       true,
			UserID:        "user456",
		},
	}

	return sites, nil
}

func (s *Scheduler) scheduleCheck(site Site) {
	s.logger.Infof("Scheduling check for site %d (%s)", site.ID, site.Name)

	// Create check job
	job := CheckJob{
		SiteID:  site.ID,
		UserID:  site.UserID,
		URL:     site.URL,
		Timeout: site.Timeout,
	}

	// Serialize job
	jobData, err := json.Marshal(job)
	if err != nil {
		s.logger.Errorf("Failed to marshal job: %v", err)
		return
	}

	// Add job to Redis Stream
	streamName := "check_jobs"
	_, err = s.redisClient.XAdd(s.ctx, &redis.XAddArgs{
		Stream: streamName,
		Values: map[string]interface{}{
			"job": string(jobData),
		},
	}).Result()

	if err != nil {
		s.logger.Errorf("Failed to add job to stream: %v", err)
		return
	}

	s.logger.Infof("Successfully scheduled check for site %d", site.ID)
}

func (s *Scheduler) Stop() {
	s.logger.Info("Stopping scheduler...")
	s.redisClient.Close()
}

func main() {
	scheduler := NewScheduler()
	defer scheduler.Stop()

	scheduler.Start()
}
