# Web Checker Scheduler

Go microservice that schedules website checks using Redis ZSET and Streams.

## Features

- **Redis Integration**: Uses Redis ZSET for scheduling and Streams for job distribution
- **Configurable Intervals**: Supports custom check intervals per site
- **Scalable**: Can run multiple scheduler instances
- **Logging**: Structured logging with logrus
- **Environment Configuration**: Supports .env files

## Architecture

The scheduler runs every minute and:

1. Fetches all enabled sites from the database
2. Checks if enough time has passed since the last check
3. Creates check jobs and adds them to Redis Streams
4. Updates the last check timestamp

## Setup

1. Install Go 1.21+
2. Install Redis
3. Set environment variables
4. Run the scheduler:

```bash
go run main.go
```

## Environment Variables

- `REDIS_URL`: Redis connection string (default: redis://localhost:6379)
- `LOG_LEVEL`: Logging level (default: info)

## Redis Keys

- `last_check:{siteId}`: Timestamp of last check for each site
- `check_jobs`: Redis Stream containing check jobs

## Job Format

```json
{
  "siteId": 1,
  "userId": "user123",
  "url": "https://example.com",
  "timeout": 10
}
```

## Scaling

Multiple scheduler instances can run simultaneously. Redis handles the coordination automatically.

## Monitoring

The scheduler logs:

- Connection status
- Sites being processed
- Jobs being scheduled
- Errors and warnings
