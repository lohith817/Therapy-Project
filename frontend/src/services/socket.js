import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
  if (socket) return socket;
  socket = io("/", {
    auth: { token },
    autoConnect: true,
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
