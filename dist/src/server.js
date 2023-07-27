"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.appRoot = void 0;
const tslib_1 = require("tslib");
const socket_io_1 = require("socket.io");
const http_1 = tslib_1.__importDefault(require("http"));
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.appRoot = path_1.default.resolve();
const sample_1 = require("./router/sample");
const page_1 = require("./router/page");
// import MqttClient from './mqtt/client';
// import MqttLog from './mqtt/log';
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = 3001;
app.use('/', page_1.page);
app.use('/sample', sample_1.sample);
exports.io = new socket_io_1.Server(server, {
    transports: ['polling'],
    cors: {
        origin: `*`,
        methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    },
});
exports.io.on('connection', (socket) => {
    console.log('client connected');
});
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map