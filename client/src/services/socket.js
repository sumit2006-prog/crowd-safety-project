import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 5000
});

socket.on('connect_error', (err) => {
  console.warn('[Socket.IO] Backend socket server offline or unreachable. Using Client Reactive Memory Store.', err.message);
});
