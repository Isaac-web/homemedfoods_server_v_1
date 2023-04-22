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
    minlength: 2,
    maxlength: 100,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 100,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    default: function () {
      return `${this.firstname} ${this.lastname}`;
    },
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
  active: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    minlength: 7,
    maxlength: 1024,
    required: true,
  },
  ordersCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  points: {
    type: Number,
    min: 0,
    default: 0,
  },
  devices: [
    {
      notificationData: {
        token: String,
        appName: String,
      },
    },
  ],
});

customerSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, active: this.active },
    config.get("auth.privateKey")
  );
};

const Customer = mongoose.model("Customer", customerSchema);

const validate = (customer) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(100).required(),
    lastname: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(7).max(150).required(),
    confirmPassword: Joi.string().min(7).max(150).required(),
    notificationToken: Joi.string().min(0).optional(),
    appName: Joi.string().min(0).max(100).optional(),
  });

  return schema.validate(customer);
};

const validateOnUpdate = (customer) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(100).required(),
    lastname: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().min(0).max(100),
    phone: Joi.string().min(3).max(15).required(),
  });

  return schema.validate(customer);
};

const validateAuth = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(150).required(),
    notificationToken: Joi.string().min(0).optional(),
    appName: Joi.string().min(0).max(100).optional(),
  });

  return schema.validate(user);
};


const validateOnResetPassword = (request) => {
  const schema = Joi.object({
    password: Joi.string().min(7).required(),
    confirmPassword: Joi.string().min(7).required(),
  });

  return schema.validate(request);
};

module.exports.validate = validate;
module.exports.validateOnUpdate = validateOnUpdate;
module.exports.validateAuth = validateAuth;
module.exports.validateOnResetPassword = validateOnResetPassword;
module.exports.Customer = Customer;
