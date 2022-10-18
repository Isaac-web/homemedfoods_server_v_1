const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();
require("dot-env");

app.get("/api/ping", (req, res) => {
  res.send(`Connected to ${config.get("db")}`);
});

mongoose
  .connect(config.get("db"))
  .then(() => console.log(`Connected to ${process.env.app_db}...`));
//   .catch((err) => console.log("Could not connect to db..."));
  
const port = process.env.PORT || 5000;
app.listen(5000, () => {console.log(`Listening on port ${port}...`)})

// const config = require("config");
// const express = require("express");

// const app = express();
// app.get("/ping", (req, res) => {
//   res.send("Pong");
// });

// console.log(config.get("db"))

// require("./startup/middleware")(app);
// require("./startup/routes")(app);
// require("./startup/connections")(app);

// module.exports = app;

