const express = require("express");
const { createServer } = require("http");
const config = require("config");
const { Customer } = require("./models/Customer");
const { deleteFile } = require("./utils/awsS3");
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

deleteFile({ Key: "products/f1054e26-9b6d-4c1a-b34f-d7ee0e36d121.jpg" });

module.exports = app;