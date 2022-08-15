const jwt = require("jsonwebtoken");
const config = require("config");
const app = require("../index");

const { Customer } = require("../models/Customer");

module.exports = async (req, res, next) => {
  if (
    process.env?.NODE_ENV === "development" &&
    config.get("enableAuth") === false
  )
    return next();

  const token = req.headers["x-auth-token"];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("auth.privateKey"));
    const customer = await Customer.findById(decoded._id);

    if (!customer) return res.status(400).send("Invalid token.");

    req.customer = customer;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
