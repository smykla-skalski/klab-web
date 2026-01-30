#!/usr/bin/env node
import { WebSocketServer } from 'ws';
import * as pty from 'node-pty';
import * as os from 'os';

const PORT = process.env.WS_PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
	console.log('Client connected');

	// Determine shell based on platform
	const shell = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : 'bash');

	// Spawn PTY
	const ptyProcess = pty.spawn(shell, [], {
		name: 'xterm-256color',
		cols: 80,
		rows: 24,
		cwd: process.env.HOME || process.cwd(),
		env: process.env
	});

	console.log(`Spawned shell: ${shell} (PID: ${ptyProcess.pid})`);

	// PTY output → WebSocket
	ptyProcess.onData((data) => {
		try {
			if (ws.readyState === 1) { // WebSocket.OPEN
				ws.send(data);
			}
		} catch (err) {
			console.error('Error sending to WebSocket:', err);
		}
	});

	// WebSocket input → PTY
	ws.on('message', (data) => {
		try {
			const message = data.toString();

			// Handle resize events
			if (message.startsWith('{')) {
				try {
					const json = JSON.parse(message);
					if (json.type === 'resize' && json.cols && json.rows) {
						ptyProcess.resize(json.cols, json.rows);
						console.log(`Resized terminal to ${json.cols}x${json.rows}`);
						return;
					}
				} catch {
					// Not JSON, treat as regular input
				}
			}

			// Regular terminal input
			ptyProcess.write(message);
		} catch (err) {
			console.error('Error writing to PTY:', err);
		}
	});

	// Handle PTY exit
	ptyProcess.onExit(({ exitCode, signal }) => {
		console.log(`PTY process exited (code: ${exitCode}, signal: ${signal})`);
		ws.close();
	});

	// Handle WebSocket close
	ws.on('close', () => {
		console.log('Client disconnected');
		try {
			ptyProcess.kill();
		} catch (err) {
			console.error('Error killing PTY:', err);
		}
	});

	// Handle WebSocket errors
	ws.on('error', (err) => {
		console.error('WebSocket error:', err);
		try {
			ptyProcess.kill();
		} catch {
			// Ignore kill errors
		}
	});
});

// Handle server errors
wss.on('error', (err) => {
	console.error('WebSocket server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, closing server...');
	wss.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('\nSIGINT received, closing server...');
	wss.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});
