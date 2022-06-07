const mongoose = require("mongoose");
const Joi = require("joi");

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxlength: 256,
      trim: true,
      required: true,
    },
    desc: {
      type: String,
      maxlength: 1024,
      trim: true,
      defualt: "",
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Discount = mongoose.model("Discount", discountSchema);

const validate = (discount) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    desc: Joi.string().max(1024),
    discountPercent: Joi.number().min(0).max(100).required(),
    isActive: Joi.boolean(),
  });

  return schema.validate(discount);
};

const validateOnUpdate = (discount) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256),
    desc: Joi.string().max(1024),
    discountPercent: Joi.number().min(0).max(100),
    isActive: Joi.boolean(),
  });

  return schema.validate(discount);
};

exports.Discount = Discount;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
