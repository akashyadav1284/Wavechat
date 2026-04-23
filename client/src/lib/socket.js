import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  // If a socket already exists AND is connected, do nothing
  if (socket?.connected) return;

  // Dev: localhost:5000 | Prod: VITE_BACKEND_URL (your Render URL)
  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Disconnect stale socket before creating a fresh one
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(BASE_URL, {
    query: { userId },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    transports: ["websocket"],
  });

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
