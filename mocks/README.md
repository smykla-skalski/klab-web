# Mock Servers

Development mock servers for local testing.

## WebSocket Server (ws-server.js)

- **Port:** 8080 (configurable via `WS_PORT`)
- **Purpose:** Mock terminal backend
- **Features:**
  - Echoes terminal input
  - Simulates basic commands (ls, pwd, echo, clear)
  - Sends formatted responses

## API Server (api-server.js)

- **Port:** 3001 (configurable via `API_PORT`)
- **Purpose:** Mock REST API for lab validation
- **Endpoints:**
  - `POST /api/validate` - Random success/failure validation
  - `GET /api/labs` - Empty labs list

## Usage

Run via mise:
```bash
mise dev
```

Or manually:
```bash
node mocks/ws-server.js &
node mocks/api-server.js &
pnpm dev
```
