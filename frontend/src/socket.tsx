import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:8080');

// Handle connection events
socket.on('connect', () => {
  console.log('Connected to backend server with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from backend server');
});

export default socket;