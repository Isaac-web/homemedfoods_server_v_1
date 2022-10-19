const mongoose = require("mongoose");
const Joi = require("joi");

const PaymentMethod = mongoose.model(
  "PaymentMethod",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
      createIndex: true,
    },
    imageUri: {
      type: String,
      maxlength: 1024,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  })
);

const validate = (paymentMethod) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    imageUri: Joi.string().max(1024),
    isActive: Joi.boolean(),
  });

  return schema.validate(paymentMethod);
};

const validateOnUpdate = (paymentMethod) => {
  const schema = Joi.object({
    name: Joi.string(),
    imageUri: Joi.string().max(1024),
    isActive: Joi.boolean(),
  });

  return schema.validate(paymentMethod);
};

exports.PaymentMethod = PaymentMethod;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
