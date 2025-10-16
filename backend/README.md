# Web Checker Backend

Spring Boot 3 backend API with Supabase JWT authentication and PostgreSQL persistence.

## Features

- **REST API**: Complete CRUD operations for sites, checks, and incidents
- **Authentication**: Supabase JWT validation middleware
- **Database**: PostgreSQL with JPA/Hibernate
- **Documentation**: OpenAPI/Swagger UI
- **Monitoring**: Spring Actuator health checks
- **Validation**: Bean validation with custom constraints

## Setup

1. Install Java 21 and Maven
2. Set up PostgreSQL database
3. Configure environment variables
4. Run the application:

```bash
mvn spring-boot:run
```

## Environment Variables

- `SUPABASE_JWT_SECRET`: Your Supabase JWT secret
- `MAIL_HOST`: SMTP host for notifications
- `MAIL_USERNAME`: SMTP username
- `MAIL_PASSWORD`: SMTP password
- `DATABASE_URL`: PostgreSQL connection string

## API Endpoints

### Sites

- `GET /api/sites` - List user's sites
- `POST /api/sites` - Create new site
- `GET /api/sites/{id}` - Get site details
- `PUT /api/sites/{id}` - Update site
- `DELETE /api/sites/{id}` - Delete site

### Check Results

- `GET /api/checks/recent` - Recent check results
- `GET /api/checks/site/{id}` - Check results for site
- `GET /api/checks/site/{id}/uptime` - Uptime percentage

### Worker API

- `POST /api/worker/check-result` - Submit check result

## Database Schema

### Sites

- id, name, url, checkInterval, timeout
- thresholds (uptime%, maxLatency, seoScore)
- queryParams (max 3)
- healthEndpoint, enabled, userId

### Check Results

- id, siteId, timestamp, status, responseTime
- statusCode, error, seoScore, userId

### Incidents

- id, siteId, type, status, startedAt, resolvedAt
- message, userId

## Security

- JWT token validation for all protected endpoints
- CORS configuration for frontend integration
- User isolation (multi-tenancy)
- Input validation and sanitization
