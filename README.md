# Remootio Webhook Service

A Dockerized Node.js service that acts as a bridge between HTTP GET webhooks and the Remootio WebSocket API.

## Features
- Connects to Remootio via local WebSocket.
- Exposes GET endpoints for open, close, and operate commands.
- Handles authentication and keepalive automatically.

## Prerequisites
- Remootio device with API enabled.
- API Secret Key and API Auth Key (from Remootio app).
- Docker installed.

## Usage

### Running with Docker

1. **Build the image**:
   ```bash
   docker build -t remootio-service .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name remootio-service \
     -e REMOOTIO_IP=192.168.1.X \
     -e REMOOTIO_API_SECRET_KEY=YOUR_SECRET_KEY \
     -e REMOOTIO_API_AUTH_KEY=YOUR_AUTH_KEY \
     -p 8080:8080 \
     remootio-service
   ```

### Webhook Endpoints
- `GET /open`: Opens the gate.
- `GET /close`: Closes the gate.
- `GET /operate`: Triggers the gate (toggle).
- `GET /status`: Queries the current status.

## Configuration
The following environment variables are required:
- `REMOOTIO_IP`: The local IP address of your Remootio device.
- `REMOOTIO_API_SECRET_KEY`: Your Remootio API Secret Key.
- `REMOOTIO_API_AUTH_KEY`: Your Remootio API Auth Key.
- `PORT` (Optional): The port the service listens on (default: 8080).
