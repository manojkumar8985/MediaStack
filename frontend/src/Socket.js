import { io } from "socket.io-client";

const socket = io("https://mediastack-1.onrender.com", {
  withCredentials: true,
});

export default socket;
