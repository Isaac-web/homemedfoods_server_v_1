const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Invitation = mongoose.model(
  "Invitation",
  new mongoose.Schema({
    employeeId: {
      type: mongoose.Types.Object,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
      required: true,
    },
    title: {
      Types: String,
      minlength: 3,
      maxlength: 256,
      trim: true,
      required: true,
    },
    message: {
      Types: String,
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
      Types: String,
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
    designationId: Joi.objectId().required(),
    stationId: Joi.objectId().required(),
  });

  return schema.validate(Invitation);
};

exports.validate = validate;
exports.Invitation = Invitation;
