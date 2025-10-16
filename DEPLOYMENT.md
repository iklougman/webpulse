# Web Checker - Production Deployment Guide

This guide covers deploying the Web Checker application to production using Kubernetes and Helm.

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Helm 3.x
- Docker registry access
- Domain name and SSL certificate

## Environment Setup

### 1. Configure Secrets

Create a Kubernetes secret with your production values:

```bash
kubectl create secret generic webchecker-secrets \
  --namespace webchecker \
  --from-literal=SUPABASE_JWT_SECRET="your-production-jwt-secret" \
  --from-literal=MAIL_USERNAME="your-production-email" \
  --from-literal=MAIL_PASSWORD="your-production-app-password" \
  --from-literal=DATABASE_USERNAME="webchecker" \
  --from-literal=DATABASE_PASSWORD="your-secure-db-password"
```

### 2. Configure ConfigMap

Update the ConfigMap with production values:

```bash
kubectl create configmap webchecker-config \
  --namespace webchecker \
  --from-literal=REDIS_URL="redis://redis-service:6379" \
  --from-literal=BACKEND_URL="http://backend-service:8080" \
  --from-literal=LOG_LEVEL="info"
```

## Deployment Options

### Option 1: Direct Kubernetes Manifests

```bash
# Apply all manifests
kubectl apply -f infra/k8s/

# Verify deployment
kubectl get pods -n webchecker
kubectl get services -n webchecker
```

### Option 2: Helm Chart (Recommended)

```bash
# Install with Helm
helm install webchecker infra/helm/webchecker \
  --namespace webchecker \
  --create-namespace \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=webchecker.yourdomain.com \
  --set frontend.image.tag=v1.0.0 \
  --set backend.image.tag=v1.0.0 \
  --set scheduler.image.tag=v1.0.0 \
  --set worker.image.tag=v1.0.0

# Upgrade existing deployment
helm upgrade webchecker infra/helm/webchecker \
  --namespace webchecker \
  --set frontend.image.tag=v1.1.0
```

## Production Configuration

### Resource Limits

Update resource requests and limits in `values.yaml`:

```yaml
frontend:
  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"

backend:
  resources:
    requests:
      memory: "1Gi"
      cpu: "1000m"
    limits:
      memory: "2Gi"
      cpu: "2000m"

worker:
  replicaCount: 5
  resources:
    requests:
      memory: "256Mi"
      cpu: "200m"
    limits:
      memory: "512Mi"
      cpu: "500m"
```

### Scaling

Scale workers based on load:

```bash
kubectl scale deployment worker-http --replicas=10 -n webchecker
```

### Monitoring

Enable monitoring with Prometheus and Grafana:

```bash
# Install Prometheus operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Add ServiceMonitor for Web Checker
kubectl apply -f infra/k8s/monitoring/
```

## SSL/TLS Configuration

### Using cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f infra/k8s/cert-manager/
```

### Update Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webchecker-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
    - hosts:
        - webchecker.yourdomain.com
      secretName: webchecker-tls
  rules:
    - host: webchecker.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 3000
```

## Database Setup

### External PostgreSQL

For production, use an external PostgreSQL database:

```yaml
# Update values.yaml
postgres:
  enabled: false

env:
  DATABASE_URL: "jdbc:postgresql://your-db-host:5432/webchecker"
```

### Database Migrations

Run migrations on deployment:

```bash
# Create migration job
kubectl apply -f infra/k8s/migrations/
```

## Backup Strategy

### Database Backups

```bash
# Create backup job
kubectl apply -f infra/k8s/backups/
```

### Redis Backups

```bash
# Enable Redis persistence
kubectl patch configmap redis-config \
  --patch '{"data":{"save":"900 1 300 10 60 10000"}}'
```

## Troubleshooting

### Common Issues

1. **Pod Startup Issues**

   ```bash
   kubectl describe pod <pod-name> -n webchecker
   kubectl logs <pod-name> -n webchecker
   ```

2. **Database Connection Issues**

   ```bash
   kubectl exec -it <backend-pod> -n webchecker -- env | grep DATABASE
   ```

3. **Redis Connection Issues**
   ```bash
   kubectl exec -it <redis-pod> -n webchecker -- redis-cli ping
   ```

### Health Checks

```bash
# Check all pods
kubectl get pods -n webchecker

# Check services
kubectl get services -n webchecker

# Check ingress
kubectl get ingress -n webchecker

# Check logs
kubectl logs -f deployment/backend -n webchecker
```

## Performance Optimization

### Horizontal Pod Autoscaling

```bash
kubectl apply -f infra/k8s/hpa/
```

### Resource Optimization

Monitor resource usage and adjust limits:

```bash
kubectl top pods -n webchecker
kubectl top nodes
```

## Security Considerations

1. **Network Policies**: Implement network policies for pod-to-pod communication
2. **RBAC**: Configure proper role-based access control
3. **Secrets Management**: Use external secret management (e.g., Vault)
4. **Image Security**: Scan images for vulnerabilities
5. **Pod Security Standards**: Enable pod security standards

## Maintenance

### Rolling Updates

```bash
# Update frontend
kubectl set image deployment/frontend frontend=webchecker/frontend:v1.1.0 -n webchecker

# Update backend
kubectl set image deployment/backend backend=webchecker/backend:v1.1.0 -n webchecker
```

### Rollback

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n webchecker

# Check rollout status
kubectl rollout status deployment/backend -n webchecker
```
