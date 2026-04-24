import { io } from "socket.io-client";

let socket = null;
let onlineUsersCallback = null;

export const connectSocket = (userId, onOnlineUsers) => {
  // Store callback to update online users
  if (onOnlineUsers) onlineUsersCallback = onOnlineUsers;

  // If already connected, just request fresh online users
  if (socket?.connected) {
    socket.emit("requestOnlineUsers");
    return;
  }

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
    // Allow polling fallback for environments that block WebSocket upgrades
    transports: ["websocket", "polling"],
  });

  // On successful connection, set up listeners and request online users
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // Listen for online users
    socket.off("getOnlineUsers");
    socket.on("getOnlineUsers", (users) => {
      if (onlineUsersCallback) onlineUsersCallback(users);
    });

    // Request current online users (avoids missing the initial broadcast)
    socket.emit("requestOnlineUsers");
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
    onlineUsersCallback = null;
  }
};

export const getSocket = () => socket;
