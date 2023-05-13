const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    createIndex: true,
    required: true,
  },
  city: {
    type: String,
    maxlength: 150,
    minlength: 2,
    required: true,
  },
  locality: {
    type: String,
    minlength: 2,
    maxlength: 150,
  },
  subLocality: {
    type: String,
    minlength: 3,
    maxlength: 256,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  digitalAddress: {
    type: String,
    maxlength: 150,
  },
});

const Address = mongoose.model("Address", addressSchema);

const validate = (address) => {
  const schema = Joi.object({
    coordinates: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required(),
    }).required(),
    city: Joi.string().min(2).max(150).required(),
    locality: Joi.string().max(150),
    subLocality: Joi.string().min(3).max(256),
    digitalAddress: Joi.string().max(150),
  });

  return schema.validate(address);
};

const validateOnUpdate = (address) => {
  const schema = Joi.object({
    coordinates: Joi.object({
      lat: Joi.number(),
      long: Joi.number(),
    }),
    city: Joi.string().min(2).max(150),
    locality: Joi.string().max(150),
    subLocality: Joi.string().max(150),
    digitalAddress: Joi.string().min(3).max(256),
  });

  return schema.validate(address);
};

exports.Address = Address;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;