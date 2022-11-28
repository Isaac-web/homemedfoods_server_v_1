const addresses = require("./../routes/addresses");
const customers = require("./../routes/customers");
const discounts = require("./../routes/discounts");
const orders = require("../routes/orders");
const paymentMethods = require("../routes/paymentMethods");
const products = require("./../routes/products");
const productCategory = require("./../routes/productCategory");
const designations = require("./../routes/designations");
const branches = require("../routes/branches");
const users = require("./../routes/users");

module.exports = (app) => {
  app.get("/ping", (req, res) => {
    res.send("Pong");
  });

  app.use("/api/addresses", addresses);
  app.use("/api/branches", branches);
  app.use("/api/categories", productCategory);
  app.use("/api/designations", designations);
  app.use("/api/discounts", discounts);
  app.use("/api/orders", orders);
  app.use("/api/payment-methods", paymentMethods);
  app.use("/api/products", products);
  app.use("/api/customers", customers);
  app.use("/api/users", users);
};
