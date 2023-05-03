const express = require("express");
const { createServer } = require("http");
const config = require("config");
require("dotenv").config();

const app = express();


if (!config.get("fcm.digimartCustomerServerKey")) {
  throw new Error(
    "SHOPPER_FCM_SERVER_KEY, RIDER_FCM_SERVER_KEY or CUSTOMER_FCM_SERVER_KEY cannot be null."
  );
}

process.on("uncaughtException", (err) => {
  console.log(err.message, err);
  process.exit(1);
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



module.exports = app;