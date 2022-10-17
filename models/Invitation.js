const mongoose = require("mongoose");
const Joi = require("joi");

console;

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    applicationLink: {
      type: String,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    issuedAt: {
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
    title: Joi.string().min(3).max(256).required(),
    message: Joi.string().min(3).max(1024).required(),
    email: Joi.string().email().required(),
    designationId: Joi.string().required(),
    branchId: Joi.string().required(),
    expiresAt: Joi.date().required(),
  });

  return schema.validate(invitation);
};

exports.validate = validate;
exports.Invitation = Invitation;
