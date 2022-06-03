const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const productCategory = require("./routes/productCategory");

const app = express();
app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", productCategory);

const port = process.env.PORT || config.get("port");
mongoose
  .connect(config.get("db"))
  .then(() => {
    app.listen(port, () => console.info(`Listening on port ${port}...`));
  })
  .catch((err) => console.error(err.message, err));
