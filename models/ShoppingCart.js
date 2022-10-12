const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

shoppingCartSchema.methods.setTotal = function (amount) {
  if (amount >= 0) {
    this.total = amount;
  }
};

shoppingCartSchema.getTotal = function () {
  return this.total;
};

shoppingCartSchema.methods.addToTotal = function (amount) {
  if (!amount < 0) this.total += amount;
};

shoppingCartSchema.methods.subtractFromTotal = function (amount) {
  if (!amount < 0) this.total -= amount;
};

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

module.exports.ShoppingCart = ShoppingCart;
