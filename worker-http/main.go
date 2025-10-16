package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

type CheckJob struct {
	SiteID  int64  `json:"siteId"`
	UserID  string `json:"userId"`
	URL     string `json:"url"`
	Timeout int    `json:"timeout"`
}

type CheckResult struct {
	SiteID       int64  `json:"siteId"`
	Timestamp    string `json:"timestamp"`
	Status       string `json:"status"`
	ResponseTime int    `json:"responseTime"`
	StatusCode   int    `json:"statusCode,omitempty"`
	Error        string `json:"error,omitempty"`
	SeoScore     int    `json:"seoScore,omitempty"`
}

type Worker struct {
	redisClient *redis.Client
	httpClient  *http.Client
	ctx         context.Context
	logger      *logrus.Logger
	backendURL  string
}

func NewWorker() *Worker {
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

	// Initialize HTTP client
	httpClient := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Get backend URL
	backendURL := os.Getenv("BACKEND_URL")
	if backendURL == "" {
		backendURL = "http://localhost:8080"
	}

	logger.Info("Worker initialized successfully")

	return &Worker{
		redisClient: redisClient,
		httpClient:  httpClient,
		ctx:         ctx,
		logger:      logger,
		backendURL:  backendURL,
	}
}

func (w *Worker) Start() {
	w.logger.Info("Starting worker...")

	// Create consumer group if it doesn't exist
	streamName := "check_jobs"
	groupName := "workers"

	err := w.redisClient.XGroupCreateMkStream(w.ctx, streamName, groupName, "0").Err()
	if err != nil && err.Error() != "BUSYGROUP Consumer Group name already exists" {
		w.logger.Errorf("Failed to create consumer group: %v", err)
		return
	}

	// Start consuming jobs
	for {
		w.consumeJobs(streamName, groupName)
		time.Sleep(1 * time.Second)
	}
}

func (w *Worker) consumeJobs(streamName, groupName string) {
	// Read from stream
	streams, err := w.redisClient.XReadGroup(w.ctx, &redis.XReadGroupArgs{
		Group:    groupName,
		Consumer: "worker-1",
		Streams:  []string{streamName, ">"},
		Count:    1,
		Block:    1 * time.Second,
	}).Result()

	if err != nil {
		if err != redis.Nil {
			w.logger.Errorf("Failed to read from stream: %v", err)
		}
		return
	}

	// Process each message
	for _, stream := range streams {
		for _, message := range stream.Messages {
			w.processJob(message)

			// Acknowledge the message
			w.redisClient.XAck(w.ctx, streamName, groupName, message.ID)
		}
	}
}

func (w *Worker) processJob(message redis.XMessage) {
	w.logger.Infof("Processing job: %s", message.ID)

	// Parse job data
	jobData, exists := message.Values["job"]
	if !exists {
		w.logger.Errorf("Job data not found in message")
		return
	}

	var job CheckJob
	err := json.Unmarshal([]byte(jobData.(string)), &job)
	if err != nil {
		w.logger.Errorf("Failed to unmarshal job: %v", err)
		return
	}

	// Perform HTTP check
	result := w.performCheck(job)

	// Submit result to backend
	w.submitResult(result)
}

func (w *Worker) performCheck(job CheckJob) CheckResult {
	w.logger.Infof("Checking URL: %s", job.URL)

	start := time.Now()

	// Create HTTP request with timeout
	ctx, cancel := context.WithTimeout(w.ctx, time.Duration(job.Timeout)*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", job.URL, nil)
	if err != nil {
		return CheckResult{
			SiteID:       job.SiteID,
			Timestamp:    time.Now().Format(time.RFC3339),
			Status:       "DOWN",
			ResponseTime: 0,
			Error:        fmt.Sprintf("Failed to create request: %v", err),
		}
	}

	// Set user agent
	req.Header.Set("User-Agent", "WebChecker/1.0")

	// Perform request
	resp, err := w.httpClient.Do(req)
	responseTime := int(time.Since(start).Milliseconds())

	if err != nil {
		return CheckResult{
			SiteID:       job.SiteID,
			Timestamp:    time.Now().Format(time.RFC3339),
			Status:       "DOWN",
			ResponseTime: responseTime,
			Error:        fmt.Sprintf("Request failed: %v", err),
		}
	}
	defer resp.Body.Close()

	// Read response body (limit to 1MB)
	body, err := io.ReadAll(io.LimitReader(resp.Body, 1024*1024))
	if err != nil {
		w.logger.Warnf("Failed to read response body: %v", err)
	}

	// Determine status
	status := "UP"
	if resp.StatusCode >= 400 {
		status = "DOWN"
	}

	// Calculate SEO score (simplified)
	seoScore := w.calculateSeoScore(resp, body)

	return CheckResult{
		SiteID:       job.SiteID,
		Timestamp:    time.Now().Format(time.RFC3339),
		Status:       status,
		ResponseTime: responseTime,
		StatusCode:   resp.StatusCode,
		SeoScore:     seoScore,
	}
}

func (w *Worker) calculateSeoScore(resp *http.Response, body []byte) int {
	score := 100

	// Check response code
	if resp.StatusCode >= 400 {
		score -= 50
	}

	// Check content type
	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		score -= 10
	}

	// Check for basic SEO elements in HTML
	bodyStr := string(body)
	if len(bodyStr) > 0 {
		// Check for title tag
		if !bytes.Contains(body, []byte("<title>")) {
			score -= 20
		}

		// Check for meta description
		if !bytes.Contains(body, []byte("meta name=\"description\"")) {
			score -= 15
		}

		// Check for h1 tag
		if !bytes.Contains(body, []byte("<h1>")) {
			score -= 10
		}
	}

	// Ensure score is between 0 and 100
	if score < 0 {
		score = 0
	}
	if score > 100 {
		score = 100
	}

	return score
}

func (w *Worker) submitResult(result CheckResult) {
	w.logger.Infof("Submitting result for site %d: %s", result.SiteID, result.Status)

	// Serialize result
	resultData, err := json.Marshal(result)
	if err != nil {
		w.logger.Errorf("Failed to marshal result: %v", err)
		return
	}

	// Submit to backend
	url := fmt.Sprintf("%s/api/worker/check-result", w.backendURL)
	resp, err := w.httpClient.Post(url, "application/json", bytes.NewBuffer(resultData))
	if err != nil {
		w.logger.Errorf("Failed to submit result: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		w.logger.Errorf("Backend returned error status: %d", resp.StatusCode)
		return
	}

	w.logger.Infof("Successfully submitted result for site %d", result.SiteID)
}

func (w *Worker) Stop() {
	w.logger.Info("Stopping worker...")
	w.redisClient.Close()
}

func main() {
	worker := NewWorker()
	defer worker.Stop()

	worker.Start()
}
