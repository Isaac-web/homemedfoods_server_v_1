const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    createIndex: true,
    required: true,
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
  area: {
    type: String,
    maxlength: 150,
    minlength: 2,
    required: true,
  },
  digitalAddress: {
    type: String,
    maxlength: 150,
  },
  street: {
    type: String,
    minlength: 2,
    maxlength: 150,
  },
  formattedAddress: {
    type: String,
    minlength: 3,
    maxlength: 256,
  },
});

const Address = mongoose.model("Address", addressSchema);

const validate = (address) => {
  const schema = Joi.object({
    coordinates: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required(),
    }).required(),
    area: Joi.string().min(2).max(150).required(),
    digitalAddress: Joi.string().max(150),
    street: Joi.string().max(150),
    formattedAddress: Joi.string().min(3).max(256),
  });

  return schema.validate(address);
};

const validateOnUpdate = (address) => {
  const schema = Joi.object({
    coordinates: Joi.object({
      lat: Joi.number(),
      long: Joi.number(),
    }),
    area: Joi.string().min(2).max(150),
    digitalAddress: Joi.string().max(150),
    street: Joi.string().max(150),
    formattedAddress: Joi.string().min(3).max(256),
  });

  return schema.validate(address);
};

exports.Address = Address;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;