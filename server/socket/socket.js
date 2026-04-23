import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/User.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// userId -> socketId mapping
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const getOnlineUsers = () => {
  return Object.keys(userSocketMap);
};

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;

    // Update user status to online
    User.findByIdAndUpdate(userId, { status: "online" }).exec();

    // Broadcast updated online users to ALL clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Also send directly back to this socket in case the broadcast
    // was emitted before the client-side listener was registered (race condition)
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Typing events
  socket.on("typing", ({ to }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { from: userId });
    }
  });

  socket.on("stopTyping", ({ to }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { from: userId });
    }
  });

  // WebRTC Signaling
  socket.on("callUser", ({ userToCall, signalData, from, name, profilePic, callType }) => {
    const receiverSocketId = userSocketMap[userToCall];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", {
        signal: signalData,
        from,
        name,
        profilePic,
        callType,
      });
    }
  });

  socket.on("answerCall", (data) => {
    const callerSocketId = userSocketMap[data.to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", data.signal);
    }
  });

  socket.on("iceCandidate", (data) => {
    const targetSocketId = userSocketMap[data.to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("iceCandidate", data.candidate);
    }
  });

  socket.on("endCall", ({ to }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("callEnded");
    }
  });

  socket.on("rejectCall", ({ to }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("callRejected");
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);

    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];

      // Update user status to offline
      User.findByIdAndUpdate(userId, {
        status: "offline",
        lastSeen: new Date(),
      }).exec();

      // Broadcast updated online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
