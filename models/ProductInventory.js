const mongoose = require("mongoose");

const ProductInventory = mongoose.model(
  "ProductInventory",
  new mongoose.Schema(
    {
      quantity: {
        type: Number,
        min: 0,
        max: 10000,
        default: 0,
      },
    },
    { timestamps: true }
  )
);

exports.ProductInventory = ProductInventory;
