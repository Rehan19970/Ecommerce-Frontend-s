import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  const API_URL =
    import.meta.env.VITE_API_URL?.replace('/api', '') ||
    'http://localhost:5000';

  socket = io(API_URL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinAdminRoom = () => {
  if (socket) {
    socket.emit('join-admin');
  }
};