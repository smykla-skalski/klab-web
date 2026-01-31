#!/usr/bin/env node
import { WebSocketServer } from 'ws';
import * as pty from 'node-pty';
import * as fs from 'fs';

const PORT = process.env.WS_PORT || 8080;
const wss = new WebSocketServer({ port: PORT, host: '127.0.0.1' });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
	console.log('Client connected');

	// Determine shell with absolute path (required for posix_spawn)
	// Try common shell locations in order of preference
	const shellCandidates = [
		'/run/current-system/sw/bin/bash',
		'/bin/bash',
		'/usr/bin/bash',
		'/bin/zsh',
		'/usr/bin/zsh',
		'/bin/sh'
	];

	let shell = shellCandidates.find((s) => {
		try {
			fs.accessSync(s, fs.constants.X_OK);
			console.log(`Found executable shell: ${s}`);
			return true;
		} catch (err) {
			console.log(`Shell not accessible: ${s} - ${err.message}`);
			return false;
		}
	});

	if (!shell) {
		console.error('No usable shell found');
		ws.send('\r\n*** Error: No usable shell found ***\r\n');
		ws.close();
		return;
	}

	console.log(`Attempting to spawn shell: ${shell}`);

	// Spawn PTY with error handling
	// Ensure PATH includes standard locations for better compatibility
	const env = { ...process.env };
	if (env.PATH && !env.PATH.split(':').includes('/usr/bin')) {
		env.PATH = `/usr/bin:/bin:${env.PATH}`;
	}

	let ptyProcess;
	try {
		ptyProcess = pty.spawn(shell, [], {
			name: 'xterm-256color',
			cols: 80,
			rows: 24,
			cwd: process.env.HOME || process.cwd(),
			env,
			uid: undefined,
			gid: undefined
		});

		console.log(`Spawned shell: ${shell} (PID: ${ptyProcess.pid})`);
	} catch (err) {
		console.error(`Failed to spawn shell ${shell}:`, err.message);
		ws.send(`\r\n*** Error: Failed to spawn shell ${shell} ***\r\n`);
		ws.send(`\r\n*** Error: ${err.message} ***\r\n`);
		ws.close();
		return;
	}

	// PTY output → WebSocket
	ptyProcess.onData((data) => {
		try {
			if (ws.readyState === 1) {
				// WebSocket.OPEN
				ws.send(data);
			}
		} catch (err) {
			console.error('Error sending to WebSocket:', err);
		}
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

	// WebSocket input → PTY
	ws.on('message', (data) => {
		try {
			const message = data.toString();

			// Handle control messages (JSON with type field)
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
