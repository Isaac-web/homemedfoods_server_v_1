const { CartItem, validate, validateOnUpdate } = require("../models/CartItem");
const { Product } = require("../models/Product");
const { ShoppingCart } = require("../models/ShoppingCart");

const addItem = async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const [product, shoppingCart] = await Promise.all([
    Product.findById(req.body.productId),
    ShoppingCart.findById(req.customer._id),
  ]);

  if (!product) return res.status(404).send("Product not found.");
  if (!shoppingCart)
    return res.status(404).send("Could not retrieve shopping cart.");

  const cartItem = new CartItem({
    cartId: req.customer._id,
    product: req.body.productId,
    quantity: req.body.quantity,
  });

  shoppingCart.addToTotal(product.price * cartItem.quantity);

  await Promise.all([cartItem.save(), shoppingCart.save()]);

  res.send(cartItem);
};

const getItems = async (req, res) => {
  const items = await CartItem.find().populate("product");

  res.send(items);
};

const updateItem = async (req, res) => {
  const { error } = await validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cartItem = await CartItem.findById(req.params.id);
  if (!cartItem) return res.status(404).send("Cart Item not found.");

  const [product, shoppingCart] = await Promise.all([
    Product.findById(cartItem.productId),
    ShoppingCart.findById(req.customer._id),
  ]);

  if (!product) return res.status(404).send("Product not found.");
  if (!shoppingCart)
    return res.status(404).send("Could not retrieve shopping cart.");

  cartItem.quantity = req.body.quantity;

  const quantityDiff = req.body.quantity - cartItem.quantity;
  shoppingCart.addToTotal(quantityDiff * product.price);

  await Promise.all([cartItem.save(), shoppingCart.save()]);

  res.send(cartItem);
};

const deleteItem = async (req, res) => {
  const cartItem = await CartItem.findById(req.params.id);
  if (!cartItem) return res.status(404).send("Cart Item not found.");

  const [product, shoppingCart] = await Promise.all(
    Product.findById(cartItem.productId),
    ShoppingCart.findById(req.customer._id)
  );

  shoppingCart.subtractFromTotal(product.price);

  await Promise.all(cartItem.remove(), shoppingCart.save());
  res.send(cartItem);
};

module.exports = {
  addItem,
  getItems,
  updateItem,
  deleteItem,
};
