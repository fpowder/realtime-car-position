import { logger } from '../logger';

import { Server } from 'socket.io';
import http from 'http';
import express, { Express } from 'express';

import path from 'path';
export const appRoot = path.resolve();

import { sample } from './router/sample';
import { page } from './router/page';

// import MqttClient from './mqtt/client';
// import MqttLog from './mqtt/log';

const app: Express = express();
const server: http.Server = http.createServer(app);
const port: number = 3001;

app.use('/', page);
app.use('/sample', sample);

export const io = new Server(server, {
	transports: ['websocket', 'polling'],
	cors: {
		origin: `*`,
		methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
	},
});

io.on('connection', (socket) => {
	console.log('client connected');
});

server.listen(port, () => {
	console.log(`server is running on port ${port}`);

    // mqtt client start after http server is started.
    // new MqttClient(io);
    // new MqttLog().onMessageLogHandler();
});
