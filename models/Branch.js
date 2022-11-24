const mongoose = require("mongoose");
const Joi = require("joi");

const Branch = mongoose.model(
  "Branch",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      maxlength: 100,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    address: {
      city: {
        type: String,
        required: false,
        maxlength: 100,
      },
      area: {
        type: String,
        required: false,
        maxlength: 100,
      },
      coordinates: {
        lat: Number,
        long: Number,
      },
    },
  })
);

const validate = (branch) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(0).max(500),
    city: Joi.string().max(100),
    area: Joi.string().max(100),
    coordinates: Joi.object({
      lat: Joi.number(),
      long: Joi.number(),
    }),
  });

  return schema.validate(branch);
};

const validateOnUpdate = (branch) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    city: Joi.string().min(0).max(100),
    area: Joi.string().min(0).max(100),
    coordinates: Joi.object({
      lat: Joi.number(),
      long: Joi.number(),
    }),
  });

  return schema.validate(branch);
};

exports.Branch = Branch;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
