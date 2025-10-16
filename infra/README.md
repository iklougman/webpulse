# Web Checker Docker Compose Setup

Docker Compose configuration for local development of the Web Checker application.

## Services

- **postgres**: PostgreSQL 15 database
- **redis**: Redis 7 cache and job queue
- **backend**: Spring Boot API server
- **scheduler**: Go scheduler service
- **worker-http**: Go HTTP worker service (2 replicas)
- **frontend**: Next.js frontend application

## Quick Start

1. **Setup Environment**:

```bash
cd infra
cp env.example .env
# Edit .env with your Supabase credentials
```

2. **Start All Services**:

```bash
docker-compose up -d
```

3. **View Logs**:

```bash
docker-compose logs -f
```

4. **Stop Services**:

```bash
docker-compose down
```

## Environment Variables

Required in `.env` file:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_JWT_SECRET`: Your Supabase JWT secret
- `MAIL_USERNAME`: Email for notifications
- `MAIL_PASSWORD`: Email app password

## Service URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Development

### Hot Reload

The frontend is configured for hot reload during development.

### Database Access

```bash
# Connect to PostgreSQL
docker exec -it webchecker-postgres psql -U webchecker -d webchecker

# Connect to Redis
docker exec -it webchecker-redis redis-cli
```

### Scaling Workers

```bash
# Scale HTTP workers
docker-compose up -d --scale worker-http=5
```

## Troubleshooting

### Check Service Health

```bash
docker-compose ps
```

### View Service Logs

```bash
docker-compose logs backend
docker-compose logs scheduler
docker-compose logs worker-http
```

### Reset Everything

```bash
docker-compose down -v
docker-compose up -d
```

## Production Notes

This setup is for development only. For production:

1. Use external PostgreSQL and Redis
2. Configure proper secrets management
3. Use production-ready images
4. Set up monitoring and logging
5. Configure SSL/TLS termination
