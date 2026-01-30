# Kubernetes Services

A **Service** is an abstraction that defines a logical set of Pods and a policy for accessing them. Services enable network communication between different components of your application.

## Why Services?

Pods are ephemeral - they can be created, destroyed, and their IP addresses change. Services provide:
- **Stable network endpoint**: Consistent DNS name and IP
- **Load balancing**: Distributes traffic across Pod replicas
- **Service discovery**: Pods can find each other by name

## Service Types

### ClusterIP (Default)
Exposes the Service on an internal IP within the cluster.

```bash
kubectl expose deployment nginx-deployment --port=80 --target-port=80
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
  - port: 80        # Service port
    targetPort: 80  # Container port
```

### NodePort
Exposes the Service on each Node's IP at a static port (30000-32767).

```yaml
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

### LoadBalancer
Provisions an external load balancer (cloud provider required).

```yaml
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
```

### ExternalName
Maps a Service to a DNS name.

```yaml
spec:
  type: ExternalName
  externalName: database.example.com
```

## Selectors and Endpoints

Services find Pods using label selectors:

```yaml
selector:
  app: nginx
  tier: frontend
```

View the Pods matched by a Service:
```bash
kubectl get endpoints nginx-service
```

## Service Discovery

### DNS
Kubernetes creates DNS records for Services:
```
<service-name>.<namespace>.svc.cluster.local
```

Example:
```bash
# From within a Pod
curl http://nginx-service.default.svc.cluster.local
```

### Environment Variables
Kubernetes injects Service information as environment variables into Pods.

## Common Patterns

### Headless Service
For direct Pod access (no load balancing):
```yaml
spec:
  clusterIP: None
  selector:
    app: nginx
```

### Multi-Port Services
```yaml
ports:
- name: http
  port: 80
  targetPort: 8080
- name: https
  port: 443
  targetPort: 8443
```

### External Traffic Policy
Control traffic routing for NodePort/LoadBalancer:
```yaml
spec:
  externalTrafficPolicy: Local  # Preserves source IP
```

## Testing Connectivity

Create a test Pod:
```bash
kubectl run test-pod --image=curlimages/curl -it --rm -- sh
```

From inside the Pod:
```bash
curl http://nginx-service
```

## Best Practices

1. **Use ClusterIP by default** - only expose externally when needed
2. **Name your ports** for better documentation
3. **Match service ports to application ports** to avoid confusion
4. **Use readiness probes** so Services only route to healthy Pods
5. **Consider NetworkPolicies** for security
