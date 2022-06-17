const config = require("config");
const express = require("express");
const mongoose = require("mongoose");

const cities = require("./routes/cities");
const designations = require("./routes/designations");
const discounts = require("./routes/discounts");
const invitations = require("./routes/invitations.js");
const products = require("./routes/products");
const productCategory = require("./routes/productCategory");
const stations = require("./routes/stations");

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
app.use("/api/designations", designations);

const port = process.env.PORT || config.get("port");
mongoose
  .connect(config.get("db"))
  .then(() => {
    app.listen(port, () => console.info(`Listening on port ${port}...`));
  })
  .catch((err) => console.error(err.message, err));
