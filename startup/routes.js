const addresses = require("./../routes/addresses");
const customers = require("./../routes/customers");
const discounts = require("./../routes/discounts");
const employees = require("../routes/employees");
const orders = require("../routes/orders");
const paymentMethods = require("../routes/paymentMethods");
const products = require("./../routes/products");
const productCategory = require("./../routes/productCategory");
const designations = require("./../routes/designations");
const cartItems = require("../routes/cartItems");
const branches = require("../routes/branches");
const invitations = require("./../routes/invitations");

// const cities = require("./../routes/cities");
// const stations = require("./../routes/stations");
// const employees = require("./../routes/employees");
// const customerAddresses = require("./../routes/customerAddresses");

module.exports = (app) => {
  app.get("/ping", (req, res) => {
    res.send("Pong");
  });

  app.use("/api/addresses", addresses);
  app.use("/api/branches", branches);
  app.use("/api/cartitems", cartItems);
  app.use("/api/categories", productCategory);
  app.use("/api/designations", designations);
  app.use("/api/discounts", discounts);
  app.use("/api/employees", employees);
  app.use("/api/invitations", invitations);
  app.use("/api/orders", orders);
  app.use("/api/payment-methods", paymentMethods);
  app.use("/api/products", products);
  app.use("/api/customers", customers);

  // app.use("/api/cities", cities);
  // app.use("/api/stations", stations);
  // app.use("/api/invitations", invitations);
  // app.use("/api/designations", designations);
  // app.use("/api/employees", employees);
  // app.use("/api/customers/addresses", customerAddresses);
};
