const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    min: 0,
  },
  optionalPrice: {
    type: Number,
    min: 0,
  },
  imageUri: {
    type: String,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

exports.orderItemSchema = orderItemSchema;
