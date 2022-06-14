const mongoose = require("mongoose");
const Joi = require("joi");

const City = mongoose.model(
  "City",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      maxlength: 256,
      trim: true,
      reuqired: true,
    },
    coordinates: {
      long: Number,
      lat: Number,
    },
  })
);

const validate = (city) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    long: Joi.number(),
    lat: Joi.number(),
  });

  return schema.validate(city);
};

const validateOnUpdate = (city) => {
  const schema = Joi.object({
    name: Joi.string().max(256),
    long: Joi.number(),
    lat: Joi.number(),
  });

  return schema.validate(city);
};

exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
exports.City = City;
