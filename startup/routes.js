const cities = require("./../routes/cities");
const designations = require("./../routes/designations");
const discounts = require("./../routes/discounts");
const invitations = require("./../routes/invitations.js");
const products = require("./../routes/products");
const productCategory = require("./../routes/productCategory");
const stations = require("./../routes/stations");
const employees = require("./../routes/employees");
const addresses = require("./../routes/addresses");
const customers = require("./../routes/customers");
const customerAddresses = require("./../routes/customerAddresses");

module.exports = (app) => {
  app.get("/ping", (req, res) => {
    res.send("Pong");
  });

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
  app.use("/api/customers/addresses", customerAddresses);
};
