# Web Checker - Multi-Service Monitoring Platform

A production-ready multi-service application that monitors website availability, performance, and SEO metrics with multi-tenancy support.

## 🏗️ Architecture

- **Frontend**: Next.js 14 + Mantine UI + Supabase Auth
- **Backend**: Spring Boot 3 + PostgreSQL + JWT validation
- **Scheduler**: Go microservice with Redis ZSET scheduling
- **Workers**: Go HTTP check workers + Node.js SEO workers
- **Infrastructure**: Docker Compose (dev) + Kubernetes + Helm (prod)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Java 21
- Go 1.21+
- kubectl (for production)

### Local Development

```bash
# Clone and setup
git clone <repo>
cd web-checker

# Copy environment variables
cp infra/env.example infra/.env

# Start all services
make dev

# Or manually with Docker Compose
docker-compose -f infra/docker-compose.yml up -d
```

### Production Deployment

```bash
# Build and deploy with Helm
make deploy

# Or manually
helm install webchecker infra/helm/webchecker/
```

## 📁 Project Structure

```
web-checker/
├── frontend/          # Next.js + Mantine + Supabase
├── backend/           # Spring Boot API
├── scheduler/         # Go scheduler service
├── worker-http/       # Go HTTP worker
├── worker-seo/        # Node.js SEO worker
├── infra/
│   ├── docker-compose.yml
│   ├── k8s/          # Kubernetes manifests
│   └── helm/         # Helm charts
├── .github/workflows/ # CI/CD pipelines
└── Makefile          # Development commands
```

## 🔧 Features

- **Multi-tenant site monitoring**
- **Real-time availability checks**
- **Performance monitoring (3G/4G simulation)**
- **SEO scoring and tracking**
- **Health endpoint monitoring**
- **Configurable notifications** (Email, Slack, Webhook)
- **Daily reports and dashboards**
- **Supabase authentication**

## 📊 Monitoring Capabilities

- **Uptime monitoring** with configurable intervals
- **Response time tracking** across different network conditions
- **SEO score monitoring** with Lighthouse integration
- **Health endpoint checks** for API monitoring
- **Incident management** with alerting

## 🔐 Security

- Supabase JWT authentication
- Multi-tenant data isolation
- Rate limiting and DDoS protection
- Secure environment variable management

## 📈 Scaling

- Horizontal scaling with Kubernetes
- Redis-based job scheduling
- Database connection pooling
- Microservice architecture

## 🛠️ Development

See individual service READMEs for detailed setup instructions:

- [Frontend Setup](frontend/README.md)
- [Backend Setup](backend/README.md)
- [Scheduler Setup](scheduler/README.md)
- [Worker Setup](worker-http/README.md)

## 📝 License

MIT License - see LICENSE file for details.
