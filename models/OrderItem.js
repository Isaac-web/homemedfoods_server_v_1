const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
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
    required: true,
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
