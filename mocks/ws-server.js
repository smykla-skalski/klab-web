#!/usr/bin/env node
import { WebSocketServer } from 'ws';

const PORT = process.env.WS_PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
	console.log('Client connected');

	// Send welcome message
	ws.send('\r\n\x1b[1;32m✓ Connected to terminal\x1b[0m\r\n');
	ws.send('$ ');

	ws.on('message', (data) => {
		const input = data.toString();
		console.log('Received:', input);

		// Echo input back
		ws.send(input);

		// Handle enter key
		if (input.includes('\r')) {
			const command = input.trim();

			// Simple command simulation
			if (command === 'ls') {
				ws.send('\r\napp.js  data  package.json  README.md\r\n$ ');
			} else if (command === 'pwd') {
				ws.send('\r\n/home/user\r\n$ ');
			} else if (command.startsWith('echo ')) {
				ws.send(`\r\n${command.slice(5)}\r\n$ `);
			} else if (command === 'clear') {
				ws.send('\x1b[2J\x1b[H$ ');
			} else if (command) {
				ws.send(`\r\n${command}: command not found\r\n$ `);
			} else {
				ws.send('\r\n$ ');
			}
		}
	});

	ws.on('close', () => {
		console.log('Client disconnected');
	});

	ws.on('error', (err) => {
		console.error('WebSocket error:', err);
	});
});
