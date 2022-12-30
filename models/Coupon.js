const mongoose = require("mongoose");
const Joi = require("joi");

const Coupon = mongoose.model(
  "Coupon",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      createIndex: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    limit: {
      type: Number,
      min: 0,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedBy: {
      type: [String],
      default: [],
    },
  })
);

const validate = (coupon) => {
  const schema = Joi.object({
    name: Joi.string().required().max(100),
    description: Joi.string().optional().min(0).max(500),
    amount: Joi.number().min(0).required(),
    limit: Joi.number().min(0).required(),
    active: Joi.boolean(),
    expiresAt: Joi.date().required(),
  });

  return schema.validate(coupon);
};

exports.validate = validate;
exports.Coupon = Coupon;
