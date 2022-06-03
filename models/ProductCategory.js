const mongoose = require("mongoose");
const Joi = require("joi");

const ProductCategory = mongoose.model(
  "ProductCategory",
  new mongoose.Schema(
    {
      name: {
        type: String,
        minlength: 2,
        maxlength: 256,
        trim: true,
        required: true,
      },
      desc: {
        type: String,
        maxlength: 1025,
        trim: true,
      },
    },
    { timestamps: true }
  )
);

const validate = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    desc: Joi.string().max(1025),
  });

  return schema.validate(category);
};

const validateOnUpdate = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256),
    desc: Joi.string().max(1025),
  });

  return schema.validate(category);
};

exports.ProductCategory = ProductCategory;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;