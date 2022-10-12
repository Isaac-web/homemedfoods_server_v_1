const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid");

const cartItemSchema = mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingCart",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      max: 10000,
      required: true,
    },
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

const validate = (item) => {
  const schema = Joi.object({
    productId: Joi.ObjectId().required(),
    quantity: Joi.number().min(1).required(),
  });

  return schema.valudate(item);
};

const validateOnUpdate = (item) => {
  const schema = Joi.object({
    quantity: Joi.number().min(1).required(),
  });

  return schema.validate(item);
};

exports.CartItem = CartItem;
exports.cartItemSchema = cartItemSchema;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
