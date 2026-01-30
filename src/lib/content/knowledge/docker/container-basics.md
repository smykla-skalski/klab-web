# Docker Container Basics

Containers are lightweight, isolated environments that package applications with their dependencies. Docker makes container management simple and portable.

## What is a Container?

A container is a runnable instance of an image. It includes:
- Application code
- Runtime environment
- System tools and libraries
- Settings

**Containers vs VMs:**
- Containers share the host OS kernel (lightweight)
- VMs include full OS (heavy)
- Containers start in seconds
- VMs take minutes

## Running Containers

### Basic docker run

```bash
docker run nginx                    # Run nginx (foreground)
docker run -d nginx                 # Detached mode (background)
docker run -d --name my-nginx nginx # Named container
```

### Port Mapping

Expose container ports to host:

```bash
docker run -d -p 8080:80 nginx     # Host:Container
docker run -d -p 80:80 nginx       # Same port
docker run -d -P nginx             # Random host ports
```

Access: `http://localhost:8080`

### Environment Variables

```bash
docker run -d -e MYSQL_ROOT_PASSWORD=secret mysql
docker run -d --env-file .env app
```

### Volume Mounts

**Bind mounts** (host directory):
```bash
docker run -d -v /host/path:/container/path nginx
docker run -d -v $(pwd):/usr/share/nginx/html nginx
```

**Named volumes** (Docker-managed):
```bash
docker run -d -v my-volume:/data postgres
```

### Interactive Mode

```bash
docker run -it ubuntu bash         # Interactive terminal
docker run -it python python3      # Python REPL
docker run -it --rm alpine sh      # Remove after exit
```

### Resource Limits

```bash
docker run -d --memory=512m nginx           # Memory limit
docker run -d --cpus=1.5 nginx              # CPU limit
docker run -d --restart=always nginx        # Auto-restart
```

## Managing Containers

### List Containers

```bash
docker ps                    # Running containers
docker ps -a                 # All containers (including stopped)
docker ps -q                 # Only container IDs
docker ps --filter status=exited
```

### Container Lifecycle

```bash
docker start container-name      # Start stopped container
docker stop container-name       # Graceful stop
docker restart container-name    # Restart
docker kill container-name       # Force stop
docker pause container-name      # Pause processes
docker unpause container-name    # Resume
```

### Execute Commands

```bash
docker exec container-name ls -la           # Run command
docker exec -it container-name bash         # Interactive shell
docker exec -u root container-name apt update  # As different user
```

### Container Logs

```bash
docker logs container-name              # View logs
docker logs -f container-name           # Follow logs
docker logs --tail 100 container-name   # Last 100 lines
docker logs --since 10m container-name  # Last 10 minutes
```

### Inspect Containers

```bash
docker inspect container-name                    # Full details (JSON)
docker inspect --format '{{.State.Status}}' ctr  # Specific field
docker stats container-name                      # Resource usage
docker top container-name                        # Running processes
```

### Copy Files

```bash
docker cp file.txt container-name:/path/      # Host to container
docker cp container-name:/path/file.txt ./    # Container to host
```

## Container Cleanup

### Remove Containers

```bash
docker rm container-name              # Remove stopped container
docker rm -f container-name           # Force remove running
docker container prune                # Remove all stopped
docker rm $(docker ps -aq)            # Remove all containers
```

### Automatic Cleanup

```bash
docker run --rm image-name            # Auto-remove after exit
```

## Working with Images

### Pull Images

```bash
docker pull nginx                     # Latest version
docker pull nginx:1.21                # Specific version
docker pull nginx:alpine              # Specific variant
```

### List Images

```bash
docker images                         # List local images
docker images -q                      # Only image IDs
docker images --filter dangling=true  # Untagged images
```

### Remove Images

```bash
docker rmi image-name                 # Remove image
docker rmi -f image-name              # Force remove
docker image prune                    # Remove unused images
docker image prune -a                 # Remove all unused
```

### Tag Images

```bash
docker tag source-image target-image
docker tag nginx:latest my-nginx:v1
```

## Common Patterns

### Run Database

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres
```

### Run Web Server

```bash
docker run -d \
  --name web \
  -p 8080:80 \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx
```

### Temporary Container

```bash
docker run --rm -it python:3.9 python
```

### Health Check

```bash
docker run -d \
  --name app \
  --health-cmd='curl -f http://localhost/ || exit 1' \
  --health-interval=10s \
  nginx
```

## Networking

### Default Networks

```bash
docker network ls                     # List networks
docker network inspect bridge         # Inspect network
```

### Container Communication

Containers on same network can communicate by name:

```bash
docker network create my-net
docker run -d --network my-net --name db postgres
docker run -d --network my-net --name app webapp
# app can connect to: postgresql://db:5432
```

## Best Practices

1. **Use specific image tags** instead of `:latest` for production
2. **Name your containers** for easier management
3. **Use volumes** for persistent data
4. **Limit resources** to prevent container from consuming all host resources
5. **Clean up regularly** with `docker system prune`
6. **Use `--rm` for temporary containers**
7. **Check logs** when containers fail to start
8. **Use health checks** for production containers
9. **Don't run containers as root** when possible
10. **One process per container** (separation of concerns)

## Troubleshooting

### Container won't start

```bash
docker logs container-name            # Check logs
docker inspect container-name         # Check configuration
docker events                         # Watch Docker events
```

### Container exited immediately

```bash
docker logs container-name            # Check what happened
docker start -ai container-name       # Start with attached logs
```

### Cannot connect to container

```bash
docker port container-name            # Check port mappings
docker inspect --format='{{.NetworkSettings.IPAddress}}' ctr
```

### High resource usage

```bash
docker stats                          # Monitor all containers
docker top container-name             # Check processes
```

## Next Steps

- Learn Dockerfile creation for custom images
- Explore Docker Compose for multi-container apps
- Study Docker networking in depth
- Understand Docker volumes and data persistence
- Learn container orchestration with Kubernetes
