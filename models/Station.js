const Joi = require("joi");
Joi.objectId = require("joi-objectid");
const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxLength: 256,
    trim: true,
    required: true,
  },
  desc: {
    type: String,
    minlength: 0,
    maxLength: 1024,
    trim: true,
  },
  coordinates: {
    long: Number,
    lat: Number,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
});

const Station = mongoose.model("Station", stationSchema);

const validate = (station) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    desc: Joi.string().max(2014),
    lat: Joi.number(),
    long: Joi.number(),
    cityId: Joi.ObjectId().required(),
  });

  return schema.validate(station);
};

const validateOnUpdate = (station) => {
  const schema = Joi.object({
    name: Joi.string().max(256),
    desc: Joi.string().max(2014),
    lat: Joi.number(),
    long: Joi.number(),
    cityId: Joi.objectId(),
  });

  return schema.validate(station);
};

module.exports.Station = Station;
module.exports.validate = validate;
module.exports.validateOnUpdate = validateOnUpdate;
