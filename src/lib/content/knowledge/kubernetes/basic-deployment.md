# Kubernetes Deployments

A **Deployment** is a Kubernetes resource that manages a replicated set of Pods. It provides declarative updates for Pods and ReplicaSets, making it the recommended way to run stateless applications.

## Key Concepts

### Replicas

Replicas define how many identical copies of a Pod should run simultaneously. This provides:

- **High availability**: If one Pod fails, others continue serving traffic
- **Load distribution**: Multiple Pods can handle more requests
- **Rolling updates**: Update Pods gradually without downtime

### Labels and Selectors

Deployments use labels to identify and manage their Pods:

```yaml
metadata:
  labels:
    app: nginx
```

## Creating a Deployment

### Imperative Method

```bash
kubectl create deployment nginx-deployment --image=nginx --replicas=3
```

### Declarative Method

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

Apply with:

```bash
kubectl apply -f deployment.yaml
```

## Common Operations

### View Deployments

```bash
kubectl get deployments
kubectl describe deployment nginx-deployment
```

### Scale Replicas

```bash
kubectl scale deployment nginx-deployment --replicas=5
```

### Update Image

```bash
kubectl set image deployment/nginx-deployment nginx=nginx:1.21
```

### Check Rollout Status

```bash
kubectl rollout status deployment/nginx-deployment
```

### Rollback

```bash
kubectl rollout undo deployment/nginx-deployment
```

## Best Practices

1. **Always specify resource limits**

```yaml
resources:
  limits:
    cpu: '500m'
    memory: '512Mi'
  requests:
    cpu: '250m'
    memory: '256Mi'
```

2. **Use health checks**

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
readinessProbe:
  httpGet:
    path: /ready
    port: 80
```

3. **Set appropriate replica counts** based on expected load and availability requirements

4. **Use meaningful labels** for organization and selection

## Deployment Strategies

- **RollingUpdate** (default): Gradually replaces old Pods with new ones
- **Recreate**: Terminates all old Pods before creating new ones
