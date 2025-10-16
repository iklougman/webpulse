# Web Checker Development Commands

.PHONY: help dev build test clean deploy docker-build docker-push

# Default target
help:
	@echo "Web Checker Development Commands"
	@echo "================================"
	@echo ""
	@echo "Development:"
	@echo "  dev          Start all services with Docker Compose"
	@echo "  dev-stop     Stop all services"
	@echo "  dev-logs     View logs from all services"
	@echo ""
	@echo "Building:"
	@echo "  build        Build all services"
	@echo "  docker-build Build all Docker images"
	@echo "  docker-push  Push all Docker images to registry"
	@echo ""
	@echo "Testing:"
	@echo "  test         Run all tests"
	@echo "  test-frontend Run frontend tests"
	@echo "  test-backend  Run backend tests"
	@echo "  test-go       Run Go tests"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy       Deploy to Kubernetes with Helm"
	@echo "  deploy-dev   Deploy to development environment"
	@echo "  deploy-prod  Deploy to production environment"
	@echo ""
	@echo "Utilities:"
	@echo "  clean        Clean build artifacts"
	@echo "  logs         View service logs"
	@echo "  status       Check service status"

# Development
dev:
	@echo "Starting Web Checker development environment..."
	@if [ ! -f infra/.env ]; then \
		echo "Creating .env file from template..."; \
		cp infra/env.example infra/.env; \
		echo "Please edit infra/.env with your configuration"; \
	fi
	docker-compose -f infra/docker-compose.yml up -d
	@echo "Services started! Frontend: http://localhost:3000"

dev-stop:
	@echo "Stopping Web Checker development environment..."
	docker-compose -f infra/docker-compose.yml down

dev-logs:
	docker-compose -f infra/docker-compose.yml logs -f

# Building
build: build-frontend build-backend build-scheduler build-worker

build-frontend:
	@echo "Building frontend..."
	cd frontend && npm install && npm run build

build-backend:
	@echo "Building backend..."
	cd backend && mvn clean package -DskipTests

build-scheduler:
	@echo "Building scheduler..."
	cd scheduler && go build -o scheduler .

build-worker:
	@echo "Building worker..."
	cd worker-http && go build -o worker .

# Docker
docker-build:
	@echo "Building Docker images..."
	docker build -t webchecker/frontend:latest frontend/
	docker build -t webchecker/backend:latest backend/
	docker build -t webchecker/scheduler:latest scheduler/
	docker build -t webchecker/worker:latest worker-http/

docker-push:
	@echo "Pushing Docker images..."
	docker push webchecker/frontend:latest
	docker push webchecker/backend:latest
	docker push webchecker/scheduler:latest
	docker push webchecker/worker:latest

# Testing
test: test-frontend test-backend test-go

test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm test --if-present && npm run lint

test-backend:
	@echo "Running backend tests..."
	cd backend && mvn test

test-go:
	@echo "Running Go tests..."
	cd scheduler && go test ./...
	cd worker-http && go test ./...

# Deployment
deploy:
	@echo "Deploying to Kubernetes..."
	kubectl apply -f infra/k8s/namespace.yaml
	kubectl apply -f infra/k8s/config.yaml
	kubectl apply -f infra/k8s/postgres.yaml
	kubectl apply -f infra/k8s/redis.yaml
	kubectl apply -f infra/k8s/backend.yaml
	kubectl apply -f infra/k8s/workers.yaml
	kubectl apply -f infra/k8s/frontend.yaml
	kubectl apply -f infra/k8s/ingress.yaml

deploy-helm:
	@echo "Deploying with Helm..."
	helm upgrade --install webchecker infra/helm/webchecker \
		--namespace webchecker \
		--create-namespace \
		--wait

deploy-dev:
	@echo "Deploying to development..."
	helm upgrade --install webchecker-dev infra/helm/webchecker \
		--namespace webchecker-dev \
		--create-namespace \
		--set ingress.enabled=false \
		--wait

deploy-prod:
	@echo "Deploying to production..."
	helm upgrade --install webchecker-prod infra/helm/webchecker \
		--namespace webchecker-prod \
		--create-namespace \
		--set ingress.enabled=true \
		--set ingress.hosts[0].host=webchecker.yourdomain.com \
		--wait

# Utilities
clean:
	@echo "Cleaning build artifacts..."
	cd frontend && rm -rf .next node_modules
	cd backend && mvn clean
	cd scheduler && rm -f scheduler
	cd worker-http && rm -f worker
	docker system prune -f

logs:
	@echo "Viewing service logs..."
	docker-compose -f infra/docker-compose.yml logs -f

status:
	@echo "Checking service status..."
	docker-compose -f infra/docker-compose.yml ps
	@echo ""
	@echo "Service URLs:"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8080"
	@echo "API Docs: http://localhost:8080/swagger-ui.html"

# Database utilities
db-migrate:
	@echo "Running database migrations..."
	cd backend && mvn flyway:migrate

db-reset:
	@echo "Resetting database..."
	docker-compose -f infra/docker-compose.yml down -v
	docker-compose -f infra/docker-compose.yml up -d postgres
	sleep 10
	make db-migrate

# Monitoring
monitor:
	@echo "Opening monitoring dashboards..."
	@echo "Grafana: http://localhost:3001"
	@echo "Prometheus: http://localhost:9090"
	@echo "Redis Commander: http://localhost:8081"

# Security
security-scan:
	@echo "Running security scans..."
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app
	cd frontend && npm audit
	cd backend && mvn org.owasp:dependency-check-maven:check
