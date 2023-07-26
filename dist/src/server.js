"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.appRoot = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../logger");
const socket_io_1 = require("socket.io");
const http_1 = tslib_1.__importDefault(require("http"));
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.appRoot = path_1.default.resolve();
const sample_1 = require("./router/sample");
const page_1 = require("./router/page");
const client_1 = tslib_1.__importDefault(require("./mqtt/client"));
const log_1 = tslib_1.__importDefault(require("./mqtt/log"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = 3001;
app.use('/', page_1.page);
app.use('/sample', sample_1.sample);
exports.io = new socket_io_1.Server(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: `*`,
        methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    },
});
exports.io.on('connection', (socket) => {
    logger_1.logger.info('client connected');
});
server.listen(port, () => {
    logger_1.logger.info(`server is running on port ${port}`);
    // mqtt client start after http server is started.
    new client_1.default(exports.io);
    new log_1.default().onMessageLogHandler();
});
//# sourceMappingURL=server.js.map