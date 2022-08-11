const jwt = require("jsonwebtoken");
const config = require("config");
const app = require("../index");

const { Customer } = require("../models/Customer");

module.exports = (req, res, next) => {
  if (app.get("env") === "development" && config.get("enableAuth") === false)
    return next();

  const token = req.headers["x-aut-token"];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("auth.privateKey"));
    const user = Customer.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
