const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// for your real project use .env file for secretes
const PORT = 80;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// Handle socket.io errors
io.on("error", (err) => {
  console.error("Socket.io Error:", err);
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Handle user disconnection
  socket.on("new message", (userData) => {
    socket.emit("new", userData);
  });

  socket.on("disconnect", (userData) => {
    console.log("USER DISCONNECTED");
    // Leave the room when the user disconnects (assuming you have userData available here)
    socket.leave(userData._id);
  });
});

// Error Handling middlewares (should be after route setups)
app.use(notFound);
app.use(errorHandler);
