const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const CustomerAddress = mongoose.model(
  "CustomerAddress",
  new mongoose.Schema({
    customerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    line_1: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    line_2: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    line_3: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    suburb: {
      type: String,
      minlength: 2,
      maxlength: 100,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      minlength: 2,
      maxlength: 100,
      trim: true,
      required: true,
    },
    digitalAddress: {
      type: String,
    },
    coords: {
      long: Number,
      lat: Number,
    },
  })
);

const validate = (address) => {
  const schema = Joi.object({
    line_1: Joi.string().max(100).required(),
    line_2: Joi.string().max(100),
    line_3: Joi.string().max(100),
    suburb: Joi.string().min(2).max(100).required(),
    city: Joi.string().min(2).max(100).required(),
    digitalAddress: Joi.string(),
    coords: {
      long: Joi.number(),
      lat: Joi.number(),
    },
  });

  return schema.validate(address);
};

const validateOnUpdate = (address) => {
  const schema = Joi.object({
    line_1: Joi.string().max(100),
    line_2: Joi.string().max(100),
    line_3: Joi.string().max(100),
    suburb: Joi.string().max(100),
    city: Joi.string().max(100),
    digitalAddress: Joi.string(),
    coords: {
      long: Joi.number(),
      lat: Joi.number(),
    },
  });

  return schema.validate(address);
};

exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
exports.CustomerAddress = CustomerAddress;
