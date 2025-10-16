# Web Checker - Multi-Service Website Monitoring Platform

A production-ready multi-service application for monitoring website availability, performance metrics, and SEO scores with real-time notifications.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 21+ (for backend development)
- Go 1.21+ (for scheduler/worker development)

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd webpulse

# Start all services
make dev

# Or manually with Docker Compose
docker-compose -f infra/docker-compose.yml up -d
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379

## 📁 Project Structure

```
webpulse/
├── frontend/          # Next.js + Mantine UI
├── backend/           # Spring Boot API
├── scheduler/         # Go scheduler service
├── worker-http/       # Go HTTP worker service
├── infra/             # Docker & Kubernetes configs
├── .github/           # GitHub Actions workflows
└── README.md
```

## 🛠 Technology Stack

### Frontend

- **Next.js 14** with App Router
- **Mantine v7** for UI components
- **Supabase** for authentication
- **TanStack Query** for data fetching
- **Joi** for form validation
- **TypeScript** for type safety

### Backend

- **Spring Boot 3** with Java 21
- **PostgreSQL** database
- **Redis** for caching and job queues
- **Supabase JWT** authentication
- **OpenAPI/Swagger** documentation

### Infrastructure

- **Docker Compose** for local development
- **Kubernetes** for production deployment
- **Helm** charts for package management
- **GitHub Actions** for CI/CD

## 🔧 Development Commands

```bash
# Start development environment
make dev

# Build all services
make build

# Run tests
make test

# Deploy to production
make deploy

# View logs
make logs

# Stop all services
make stop
```

## 🔐 Environment Setup

### Frontend Environment

Copy `frontend/env.example` to `frontend/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend Environment

Copy `infra/env.example` to `infra/.env`:

```bash
POSTGRES_USER=webchecker
POSTGRES_PASSWORD=webchecker
POSTGRES_DB=webchecker
REDIS_PASSWORD=redis_password
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

## 🚀 Deployment

### Docker Compose (Local)

```bash
docker-compose -f infra/docker-compose.yml up -d
```

### Kubernetes (Production)

```bash
# Deploy with Helm
helm install webchecker infra/helm/webchecker

# Or with kubectl
kubectl apply -f infra/k8s/
```

## 📊 Features

- ✅ **Multi-Site Monitoring**: Monitor unlimited websites
- ✅ **Real-time Status**: Live availability and performance tracking
- ✅ **Scheduled Checks**: Custom intervals for 3G/4G performance
- ✅ **SEO Monitoring**: Track SEO scores and health metrics
- ✅ **Smart Notifications**: Email, Slack, and webhook alerts
- ✅ **User Authentication**: Secure Supabase-based auth
- ✅ **Responsive Dashboard**: Modern Mantine UI
- ✅ **API Documentation**: OpenAPI/Swagger integration

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:

- **Automated Testing**: Unit and integration tests
- **Security Scanning**: Vulnerability detection
- **Docker Builds**: Multi-architecture image builds
- **Kubernetes Deployment**: Automated production deployments

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Infrastructure README](infra/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in this repository
- Check the documentation in each service directory
- Review the deployment guide for production setup

---

**Built with ❤️ using modern web technologies**
