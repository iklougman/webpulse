# Web Checker HTTP Worker

Go microservice that performs HTTP checks on websites and submits results to the backend.

## Features

- **Redis Streams**: Consumes check jobs from Redis Streams
- **HTTP Checks**: Performs GET requests with configurable timeouts
- **SEO Scoring**: Basic SEO score calculation based on HTML content
- **Result Submission**: Posts results back to the Spring Boot backend
- **Scalable**: Multiple worker instances can run simultaneously
- **Error Handling**: Comprehensive error handling and logging

## Architecture

The worker:

1. Consumes jobs from Redis Streams using consumer groups
2. Performs HTTP GET requests with configurable timeouts
3. Calculates basic SEO scores based on HTML content
4. Submits results to the Spring Boot backend API
5. Acknowledges processed messages

## Setup

1. Install Go 1.21+
2. Install Redis
3. Set environment variables
4. Run the worker:

```bash
go run main.go
```

## Environment Variables

- `REDIS_URL`: Redis connection string (default: redis://localhost:6379)
- `BACKEND_URL`: Backend API URL (default: http://localhost:8080)
- `LOG_LEVEL`: Logging level (default: info)

## Check Process

1. **Job Consumption**: Reads jobs from `check_jobs` Redis Stream
2. **HTTP Request**: Performs GET request with timeout
3. **Response Analysis**: Checks status code and response time
4. **SEO Scoring**: Analyzes HTML for basic SEO elements
5. **Result Submission**: Posts result to backend API

## SEO Score Calculation

The worker calculates a basic SEO score based on:

- HTTP status code (400+ = -50 points)
- Content-Type header presence (-10 if missing)
- HTML title tag presence (-20 if missing)
- Meta description presence (-15 if missing)
- H1 tag presence (-10 if missing)

Score ranges from 0-100.

## Scaling

Multiple worker instances can run simultaneously. Redis Streams with consumer groups handle load balancing automatically.

## Error Handling

- Network timeouts
- Invalid URLs
- Backend API failures
- Redis connection issues
- Malformed job data

All errors are logged and handled gracefully.
