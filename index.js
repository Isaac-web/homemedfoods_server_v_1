const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const productCategory = require("./routes/productCategory");
const products = require("./routes/products");
const discounts = require("./routes/discounts");
const cities = require("./routes/cities");
const stations = require("./routes/stations");
const invitations = require("./routes/invitations.js");

const app = express();
app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/categories", productCategory);
app.use("/api/products", products);
app.use("/api/discounts", discounts);
app.use("/api/cities", cities);
app.use("/api/stations", stations);
app.use("/api/invitations", invitations);


const port = process.env.PORT || config.get("port");
mongoose
  .connect(config.get("db"))
  .then(() => {
    app.listen(port, () => console.info(`Listening on port ${port}...`));
  })
  .catch((err) => console.error(err.message, err));
