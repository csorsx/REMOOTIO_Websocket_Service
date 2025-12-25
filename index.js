const RemootioDevice = require('remootio-api-client');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

const deviceIp = process.env.REMOOTIO_IP;
const apiSecretKey = process.env.REMOOTIO_API_SECRET_KEY;
const apiAuthKey = process.env.REMOOTIO_API_AUTH_KEY;

if (!deviceIp || !apiSecretKey || !apiAuthKey) {
    console.error('Missing required environment variables: REMOOTIO_IP, REMOOTIO_API_SECRET_KEY, REMOOTIO_API_AUTH_KEY');
    process.exit(1);
}

const device = new RemootioDevice(deviceIp, apiSecretKey, apiAuthKey);

device.on('connecting', () => {
    console.log('Connecting to Remootio device at', deviceIp);
});

device.on('connected', () => {
    console.log('Connected to Remootio device');
    device.authenticate();
});

device.on('authenticated', () => {
    console.log('Authenticated with Remootio device');
});

device.on('error', (err) => {
    console.error('Remootio Error:', err);
});

device.on('disconnect', () => {
    console.log('Disconnected from Remootio device');
});

device.on('incomingmessage', (frame) => {
    console.log('Incoming message:', JSON.stringify(frame, null, 2));
});

// Helper to handle client requests
async function handleAction(res, actionName, actionFn) {
    console.log(`Executing ${actionName} command...`);
    try {
        if (!device.isAuthenticated) {
            console.warn('Device not authenticated. Attempting to authenticate before command...');
            // In a real scenario, the library should handle reconnection/re-auth,
            // but we check here to be safe and provide feedback.
            return res.status(503).json({ success: false, error: 'Device not authenticated' });
        }
        
        // The library methods like sendOpen(), sendClose(), sendTrigger() 
        // usually return immediately as they send the WS frame.
        // We wait for a bit or just assume success of sending.
        actionFn();
        res.json({ success: true, message: `${actionName} command sent` });
    } catch (error) {
        console.error(`Error executing ${actionName}:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
}

app.get('/open', (req, res) => {
    handleAction(res, 'OPEN', () => device.sendOpen());
});

app.get('/close', (req, res) => {
    handleAction(res, 'CLOSE', () => device.sendClose());
});

app.get('/operate', (req, res) => {
    handleAction(res, 'TRIGGER', () => device.sendTrigger());
});

app.get('/status', (req, res) => {
    handleAction(res, 'QUERY', () => device.sendQuery());
});

app.listen(port, () => {
    console.log(`Remootio Webhook Service listening on port ${port}`);
    device.connect();
});
