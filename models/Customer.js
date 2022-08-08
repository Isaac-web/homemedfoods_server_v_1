const mongoose = require("mongoose");
const Joi = require("joi");

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
  password: {
    type: String,
    minlength: 7,
    maxlength: 1024,
    required: true,
  },
});

const validate = (customer) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(100).required(),
    lastname: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().max(100).require(),
    phone: Joi.string().min(3).max(15),
  });

  return schema.validate(customer);
};

const Customer = mongoose.model("Customer", customerSchema);

module.exports.validate = validate;
module.exports.Customer = Customer;
