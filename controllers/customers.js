const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Customer, validate, validateAuth } = require("../models/Customer");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //For now, email customer will be logged in automatically
  //without having to verify his/her email
  //Todo: Implement email verification

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("Passwords donnot match.");

  let customer = await Customer.findOne({ email: req.body.email });
  if (customer) return res.status(400).send("Email is already taken.");

  customer = new Customer(
    _.pick(req.body, ["firstname", "lastname", "phone", "email"])
  );

  //hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  customer.password = hashedPassword;

  await customer.save();
  customer.password = undefined;

  const token = customer.generateAuthToken
  res.header("x-aut-token", token).send(customer);
};

const login = async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(404).send("User not found.");

  const token = customer.generateAuthToken();
  res.send(token);
};

module.exports = {
  register,
  login
};
