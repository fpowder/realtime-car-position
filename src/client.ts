import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000', {
    reconnectionDelay: 1000,
	transports: ['websocket']
});

socket.io.on('error', (error) => {
	console.log('error occurred', error);
})

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