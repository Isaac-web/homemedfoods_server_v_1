const { Order, validate, validateOnUpdate } = require("../models/Order");
const { PaymentMethod } = require("../models/PaymentMethod");

const createOrder = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const paymentMethod = await PaymentMethod.findById(
    req.body.payment_method_id
  );
  if (!paymentMethod) return res.status(404).send("Payment method not found.");

  const orderItems = req.body.order_items.map((item) => ({
    product: item.productId,
    quantity: item.quantity,
  }));

  const order = new Order({
    customer: req.customer._id,
    comment: req.body.comment,
    order_items: orderItems,
    delivery_address: req.body.delivery_address,
    payment_method: paymentMethod,
    total: req.body.total,
  });

  await order.save();

  res.send(order);
};

const getOrders = async (req, res) => {
  let orders = await Order.find().populate("customer");

  res.send(orders);
};

const getCustomerOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.customer._id });

  res.send(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {
    $set: {
      "status.updated_at": Date.now(),
    },
    $inc: {
      "status.value": 1,
    },
  });

  if (!order) return req.status(404).send("Order not found.");

  res.send(order);
};

const updateOrder = async (req, res) => {
  const {error} = validateOnUpdate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const { comment, delivered_at, riderId } = req.body;

  const order = await Order.findById(req.params.id);

  if (comment) order.comment = comment;
  if (delivered_at) order.delivered_at = delivered_at;
  if (riderId) order.rider = riderId;

  await order.save();

  res.send(order)
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  updateOrder,
  getCustomerOrders,
};
