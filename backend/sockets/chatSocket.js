const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

// Map of userId -> socketId for direct delivery
const onlineUsers = new Map();

const initChatSocket = (io) => {
  // Authenticate socket connections using the JWT issued at login
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token missing"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user ${socket.userId})`);
    onlineUsers.set(socket.userId, socket.id);

    // Notify everyone this user is online
    io.emit("user-online", { userId: socket.userId });

    // Join a private room per conversation for scalability
    socket.on("join-room", ({ otherUserId }) => {
      const room = [socket.userId, otherUserId].sort().join("-");
      socket.join(room);
    });

    // Send message: persists to DB, then emits to receiver + sender
    socket.on("send-message", async ({ receiverId, message, fileUrl }) => {
      try {
        const saved = await Message.create({
          senderId: socket.userId,
          receiverId,
          message: message || "",
          fileUrl: fileUrl || "",
        });

        const room = [socket.userId, receiverId].sort().join("-");
        io.to(room).emit("receive-message", saved);

        // Also emit directly in case receiver hasn't joined the room yet
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", saved);
        }
      } catch (err) {
        socket.emit("message-error", { message: err.message });
      }
    });

    // Typing indicator
    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId: socket.userId });
      }
    });

    socket.on("stop-typing", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop-typing", { senderId: socket.userId });
      }
    });

    // Read receipts
    socket.on("mark-read", async ({ otherUserId }) => {
      await Message.updateMany(
        { senderId: otherUserId, receiverId: socket.userId, isRead: false },
        { isRead: true }
      );
      const otherSocketId = onlineUsers.get(otherUserId);
      if (otherSocketId) {
        io.to(otherSocketId).emit("messages-read", { readerId: socket.userId });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      io.emit("user-offline", { userId: socket.userId });
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initChatSocket;
