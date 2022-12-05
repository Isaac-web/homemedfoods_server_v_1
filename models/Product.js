const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 256,
    trim: true,
    required: true,
  },
  desc: {
    type: String,
    maxlength: 1024,
    trim: true,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    max: 1000,
    required: true,
  },
  unit: {
    type: String,
    maxlength: 200,
  },
  priceFixed: {
    type: Boolean,
    default: true,
  },
  image: {
    url: String,
    public_id: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
  },
});

const Product = mongoose.model("Product", productSchema);

const validate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    desc: Joi.string().max(1024),
    categoryId: Joi.objectId().required(),
    price: Joi.number().min(0).max(1000).required(),
    unit: Joi.string().min(0).max(1024),
    priceFixed: Joi.boolean(),
    imageUri: Joi.string().max(1024),
    imagePublicId: Joi.string().max(1024),
    status: Joi.boolean().default(true),
    discountId: Joi.objectId(),
  });

  return schema.validate(product);
};

const validateOnUpdate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256),
    desc: Joi.string().max(1024),
    categoryId: Joi.objectId(),
    price: Joi.number().min(0).max(1000),
    unit: Joi.string().min(0).max(1024),
    priceFixed: Joi.boolean(),
    imageUri: Joi.string().max(1024),
    quantity: Joi.number().min(0).max(10000),
    discountId: Joi.objectId(),
  });

  return schema.validate(product);
};

exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
exports.Product = Product;
