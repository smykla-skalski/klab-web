#!/usr/bin/env node
import { createServer } from 'http';

const PORT = process.env.API_PORT || 3001;

const server = createServer((req, res) => {
	// CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		res.end();
		return;
	}

	console.log(`${req.method} ${req.url}`);

	// Validation endpoint
	if (req.url.startsWith('/api/validate') && req.method === 'POST') {
		let body = '';
		req.on('data', chunk => { body += chunk; });
		req.on('end', () => {
			const data = JSON.parse(body);
			console.log('Validation request:', data);

			// Random success/failure for demo
			const success = Math.random() > 0.3;

			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({
				success,
				message: success
					? 'Great job! Your solution is correct.'
					: 'Not quite right. Check your configuration and try again.',
				hints: success ? [] : ['Check the service port', 'Verify the selector labels']
			}));
		});
		return;
	}

	// Labs endpoint
	if (req.url.startsWith('/api/labs') && req.method === 'GET') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ labs: [] }));
		return;
	}

	// 404
	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
	console.log(`API server listening on http://localhost:${PORT}`);
});
