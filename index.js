const express = require("express");
const { createServer } = require("http");
const config = require("config");
require("dotenv").config();

const app = express();

process.on("uncaughtException", (err) => {
  console.log(err.message, err);
});
process.on("unhandledRejection", (err) => {
  throw new Error(err);
});

if (app.get("env") === "production" && !config.get("auth.privateKey"))
  throw new Error("jwt privkate key not provided.");

const httpServer = createServer(app);
app.get("/ping", (req, res) => {
  res.send("Pong");
});

require("./startup/middleware")(app);
require("./startup/routes")(app);
require("./startup/connections")(httpServer);
require("./startup/error")(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

let usersOnline = [];
const addUserOnline = (userId, socketId) => {
  const index = usersOnline.findIndex((user) => user.userId === userId);
  if (index == -1) {
    usersOnline.push({ userId, socketId });
  }
};

const removeUserOnline = (socketId) => {
  usersOnline = usersOnline.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  socket.on("userOnline", ({ userId }) => {
    addUserOnline(userId, socket.id);
  });
  socket.on("disconnect", () => removeUserOnline(socket.id));
});

app.set("io", io);

module.exports = app;

