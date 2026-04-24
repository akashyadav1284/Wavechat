import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return;

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Clean up any stale socket first
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  socket = io(BASE_URL, {
    query: { userId },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 15,
    transports: ["websocket", "polling"],
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
