const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


const emailValidationRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const Invitation = mongoose.model(
  "Invitation",
  new mongoose.Schema({
    employeeId: {
      type: mongoose.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
      required: true,
    },
    email: {
      type: String,
      minlength: 7,
      maxlength: 256,
      regex: emailValidationRegex,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      minlength: 3,
      maxlength: 256,
      trim: true,
      required: true,
    },
    message: {
      type: String,
      minlength: 3,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    designation: {
      type: mongoose.Schema.Types.Object,
      ref: "Designation",
      required: true,
    },
    station: {
      type: mongoose.Schema.Types.Object,
      ref: "Station",
      required: true,
    },
    applicationLink: {
      type: String,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    sentAt: {
      type: Date,
      default: function () {
        return Date.now();
      },
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  })
);

const validate = (invitation) => {
  const schema = Joi.object({
    title: Joi.string(),
    message: Joi.string(),
    email: Joi.string().email().required(),
    designationId: Joi.objectId().required(),
    stationId: Joi.objectId().required(),
    expiresAt: Joi.date().required(),
  });

  return schema.validate(invitation);
};

exports.validate = validate;
exports.Invitation = Invitation;
