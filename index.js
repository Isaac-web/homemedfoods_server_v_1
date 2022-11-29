const express = require("express");
const { createServer } = require("http");
const config = require("config");

const app = express();

app.get("/ping", (req, res) => {
  res.send("Pong");
});

process.on("uncaughtException", (err) => {
  console.log(err.message, err);
});
process.on("unhandledRejection", (err) => {
  throw new Error(err);
});

if (app.get("env") === "production" && !config.get("auth.privateKey"))
  throw new Error("jwt privkate key not provided.");

const httpServer = createServer(app);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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

module.exports.ioHandler = (io) => {
  console.log("1 person connected.");
};

io.on("connection", (socket) => {
  console.log("1 User connected...");
});

io.on("firstEvent", () => {
  console.log("There was an event...");
});

module.exports = app;
