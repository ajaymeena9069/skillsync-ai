// server/src/sockets/socketHandler.js
import { Server } from "socket.io";

let io;

// Map of connected users: { userId: socketId }
const connectedUsers = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New socket connection established: ${socket.id}`);
    
    // When a user logs in or connects, they emit "register" with their userId
    socket.on("register", (userId) => {
      if (userId) {
        connectedUsers.set(userId.toString(), socket.id);
        console.log(`✅ User registered to socket: ${userId} -> ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });

  return io;
};

// Helper function to emit an event to a specific user
export const emitToUser = (userId, eventName, payload) => {
  if (!io) return;
  const socketId = connectedUsers.get(userId.toString());
  console.log(`📡 Emitting ${eventName} to user ${userId} | Found Socket ID: ${socketId || 'NOT FOUND'}`);
  if (socketId) {
    io.to(socketId).emit(eventName, payload);
  }
};
