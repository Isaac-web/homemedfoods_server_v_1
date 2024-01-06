const mongoose = require('mongoose');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid');

const Location = mongoose.model(
  'Location',
  new mongoose.Schema({
    userId: {
      type: mongoose.Types.ObjectId,
      unique: true,
      required: true,
    },
    coords: {
      lng: Number,
      lan: Number,
    },
  })
);

const validateLocation = (location) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    coords: Joi.object({
      lng: Joi.number(),
      lan: Joi.number(),
    }),
  });

  return schema.validate(location);
};

const validateLocationUpdate = (location) => {
  const schema = Joi.object({
    coords: Joi.object({
      lng: Joi.number(),
      lan: Joi.number(),
    }),
  });

  return schema.validate(location);
};

module.exports.Location = Location;
module.exports.validateLocation = validateLocation;
module.exports.validateLocationUpdate = validateLocationUpdate;
