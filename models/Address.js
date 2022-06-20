const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    line_1: {
      type: String,
      maxlength: 3,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    line_2: {
      type: String,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    line_3: {
      type: String,
      maxlength: 1024,
      trim: true,
    },
    city: {
      type: String, 
      minlength: 2,
      maxlength: 256,
      required: true,
    },
    coordinates: {
      long: Number,
      lat: Number,
    },
  })
);

const validate = (address) => {
  const schema = Joi.object({
    line_1: Joi.string().min(3).max(1024).required(),
    line_2: Joi.string().min(3).max(1024).required(),
    line_3: Joi.string().max(1024),
    city: Joi.string().min(2).max(256).required(),
    coordinates: {
      long: Joi.number(),
      lat: Joi.number(),
    },
  });

  return schema.validate(address);
};

exports.Address = Address;
exports.validate = validate;
