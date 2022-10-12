const { Order, validate } = require("../models/Order");

const createOrder = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = new Order({
    customer: req.customer._id,
    comment: req.body.comment,
    order_items: req.body.order_items,
    delivery_address: req.body.delivery_address,
    payment_method: req.body.payment_method,
    total: req.body.total,
  });

  //   await order.save();

  res.send(order);
};

module.exports = {
  createOrder,
};
