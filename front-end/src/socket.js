import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('⚡ Connected to EduSync Socket.IO backend server:', socket.id);
});

socket.on('connect_error', (err) => {
  console.warn('⚠️ Socket connection warning (using offline fallback if backend server is starting):', err.message);
});
