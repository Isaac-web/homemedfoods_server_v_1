const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 7,
    maxlength: 100,
    trim: true,
    required: true,
    createIndex: true,
  },
  firstname: {
    type: String,
    minlength: 3,
    maxlength: 100,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 100,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    minlength: 7,
    maxlength: 1024,
    required: true,
  },
});

customerSchema.methods.generateAuthToken = function () {
  console.log("Hello World");
  return jwt.sign({ _id: this._id }, config.get("auth.privateKey"));
};

const Customer = mongoose.model("Customer", customerSchema);


const validate = (customer) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(100).required(),
    lastname: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(7).max(150).required(),
    confirmPassword: Joi.string().min(7).max(150).required(),
  });

  return schema.validate(customer);
};

const validateAuth = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(150).required(),
  });

  return schema.validate(user);
};


module.exports.validate = validate;
module.exports.validateAuth = validateAuth
module.exports.Customer = Customer;
