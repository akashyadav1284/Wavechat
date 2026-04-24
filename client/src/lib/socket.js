import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  // If already connected, do nothing
  if (socket?.connected) return;

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
    // Allow polling fallback for Render environments
    transports: ["websocket", "polling"],
  });

  socket.on("connect_error", (err) => {
    console.warn("⚠️ Socket connection error:", err.message);
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
