"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)('http://localhost:3000', {
    reconnectionDelay: 1000,
    transports: ['websocket']
});
socket.io.on('error', (error) => {
    console.log('error occurred', error);
});
socket.on('connect', () => {
    console.log('client conneceted');
});
let count = 0;
socket.on('position', (data) => {
    console.log(++count, data);
});
socket.on('data', (data) => {
    console.log(data);
});
//# sourceMappingURL=client.js.map