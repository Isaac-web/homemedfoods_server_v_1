const config = require("config");
const express = require("express");

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

require("./startup/middleware")(app);
require("./startup/routes")(app);
require("./startup/connections")(app);
require("./startup/error")(app);

module.exports = app;
