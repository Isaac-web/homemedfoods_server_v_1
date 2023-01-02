const express = require("express");
const { createServer } = require("http");
const config = require("config");
const { Customer } = require("./models/Customer");
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

const modifyCustomerContact = async () => {
  const customers = await Customer.find();

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];

    if (customer.phone.charAt(0) === "0") {
      customer.phone = "+233" + customer.phone.slice(1);
      await customer.save();
    }
  }
};

modifyCustomerContact();

module.exports = app;

