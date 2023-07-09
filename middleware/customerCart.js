const { Cart } = require("../models/Cart");

module.exports = async (req, res, next) => {
    const customer = req.customer;

    let cart = await Cart.findOne({ userId: customer._id })
    if (!cart) cart = new Cart({ userId: customer._id });

    await cart.save();

    req.cart = cart;


    next()
}