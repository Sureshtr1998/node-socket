const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    if (data.room === "") {
      //io emit for sending message for all including current client
      // socket.broadcastemit is for all clients except current
      io.emit("receive_message", data);
    } else {
      //io TO for sending message for all including current client
      // socket.to is for all clients except current
      io.to(data.room).emit("receive_message", data);
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
