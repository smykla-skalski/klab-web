# ConfigMaps and Secrets

Kubernetes provides two resources for managing configuration data: **ConfigMaps** for non-sensitive data and **Secrets** for sensitive information.

## ConfigMaps

ConfigMaps store configuration data as key-value pairs, making it easy to decouple configuration from container images.

### Creating ConfigMaps

**From literal values:**
```bash
kubectl create configmap app-config \
  --from-literal=app.mode=production \
  --from-literal=log.level=info
```

**From files:**
```bash
kubectl create configmap app-config --from-file=app.properties
```

**From YAML:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.mode: production
  log.level: info
  app.properties: |
    database.host=localhost
    database.port=5432
```

### Using ConfigMaps

**As environment variables:**
```yaml
env:
- name: APP_MODE
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: app.mode
```

**All keys as environment variables:**
```yaml
envFrom:
- configMapRef:
    name: app-config
```

**As volume mounts:**
```yaml
volumes:
- name: config-volume
  configMap:
    name: app-config

volumeMounts:
- name: config-volume
  mountPath: /etc/config
```

## Secrets

Secrets store sensitive data like passwords, tokens, and keys. Data is base64-encoded and can be encrypted at rest.

### Creating Secrets

**From literal values:**
```bash
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123
```

**From files:**
```bash
kubectl create secret generic tls-secret \
  --from-file=tls.crt \
  --from-file=tls.key
```

**From YAML:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=       # base64 encoded
  password: c2VjcmV0MTIz   # base64 encoded
```

Encode values:
```bash
echo -n 'admin' | base64
```

### Secret Types

- **Opaque**: Default, arbitrary user-defined data
- **kubernetes.io/service-account-token**: Service account token
- **kubernetes.io/dockerconfigjson**: Docker registry credentials
- **kubernetes.io/tls**: TLS certificate and key

### Using Secrets

**As environment variables:**
```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-secret
      key: password
```

**As volume mounts:**
```yaml
volumes:
- name: secret-volume
  secret:
    secretName: db-secret

volumeMounts:
- name: secret-volume
  mountPath: /etc/secrets
  readOnly: true
```

**For image pull:**
```yaml
imagePullSecrets:
- name: registry-secret
```

## Best Practices

### ConfigMaps
1. **Use for non-sensitive configuration** only
2. **Keep ConfigMaps small** - large data should use volumes
3. **Version ConfigMap names** (e.g., `app-config-v2`) for safer updates
4. **Document structure** for team understanding

### Secrets
1. **Never commit Secrets to version control**
2. **Enable encryption at rest** in production
3. **Use RBAC** to restrict Secret access
4. **Consider external secret management** (Vault, AWS Secrets Manager)
5. **Rotate credentials regularly**
6. **Use least privilege** - only mount needed Secrets

## Advanced Patterns

### Immutable ConfigMaps/Secrets
Prevent accidental updates:
```yaml
immutable: true
```

### Projected Volumes
Combine multiple ConfigMaps/Secrets:
```yaml
volumes:
- name: all-config
  projected:
    sources:
    - configMap:
        name: app-config
    - secret:
        name: db-secret
```

### Watching for Changes
ConfigMaps/Secrets mounted as volumes update automatically (with eventual consistency). Environment variables do not update - Pod restart required.

## Viewing Data

**ConfigMaps:**
```bash
kubectl get configmap app-config -o yaml
```

**Secrets (base64 decoded):**
```bash
kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 -d
```
