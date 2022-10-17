const config = require("config");
const express = require("express");

const app = express();
app.get("/ping", (req, res) => {
  res.send("Pong");
});

console.log(config.get("db"))

require("./startup/middleware")(app);
require("./startup/routes")(app);
require("./startup/connections")(app);

module.exports = app;
