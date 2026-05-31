import { io } from "socket.io-client";

console.log("Starting socket test...");
const socket = io("http://localhost:5000", { withCredentials: true });

socket.on("connect", () => {
  console.log("✅ Successfully connected to Socket.io server! socket.id:", socket.id);
  socket.emit("register", "test_user_id_123");
  console.log("Emitted register event");
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
});

setTimeout(() => {
  console.log("Test finished, exiting...");
  process.exit(0);
}, 3000);
