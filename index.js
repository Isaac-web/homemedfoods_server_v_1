const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const config = require("config");
const debugdb = require("debug")("db");

const cities = require("./routes/cities");
const designations = require("./routes/designations");
const discounts = require("./routes/discounts");
const invitations = require("./routes/invitations.js");
const products = require("./routes/products");
const productCategory = require("./routes/productCategory");
const stations = require("./routes/stations");
const employees = require("./routes/employees");
const addresses = require("./routes/addresses");
const customers = require("./routes/customers");

const app = express();
app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/categories", productCategory);
app.use("/api/products", products);
app.use("/api/discounts", discounts);
app.use("/api/cities", cities);
app.use("/api/stations", stations);
app.use("/api/invitations", invitations);
app.use("/api/designations", designations);
app.use("/api/employees", employees);
app.use("/api/addresses", addresses);
app.use("/api/customers", customers);

const port = process.env.PORT || config.get("port");
mongoose
  .connect(config.get("db"))
  .then(() => {
    debugdb(`Connected to mongodb: ${config.get("db")}`);
    app.listen(port, () => console.info(`Listening on port ${port}...`));
  })
  .catch((err) => console.error(err.message, err));

module.exports = app;
