const { Branch } = require("../models/Branch");
const { Order, validate, validateOnUpdate } = require("../models/Order");
const { PaymentMethod } = require("../models/PaymentMethod");

const createOrder = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const [branch, paymentMethod] = await Promise.all([
    Branch.findById(req.body.branch),
    PaymentMethod.findById(req.body.payment_method_id),
  ]);

  if (!branch) return res.status(404).send("Branch not found.");
  if (!paymentMethod) return res.status(404).send("Payment method not found.");

  let orderItemsTotal = 0;
  const orderItems = req.body.order_items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    optionalPrice: item.optionalPrice,
    unitPrice: item.unitPrice,
    imageUri: item.imageUri,
    quantity: item.quantity,
    subtotal: (orderItemsTotal += item.optionalPrice
      ? item.optionalPrice * item.quantity
      : item.unitPrice * item.quantity),
  }));

  const order = new Order({
    customer: req.customer._id,
    comment: req.body.comment,
    order_items: orderItems,
    delivery_address: req.body.delivery_address,
    branch: branch,
    payment_method: paymentMethod,
    subtotal: orderItemsTotal,
    deliveryFee: req.body.deliveryFee,
    total: orderItemsTotal + req.body.deliveryFee,
  });

  await order.save();

  const io = req.app.get("io");
  io.emit("newOrder", JSON.stringify(order));

  res.send(order);
};

const getOrders = async (req, res) => {
  let orders = await Order.find().populate("customer").populate("branch");

  res.send(orders);
};

const getBranchOrders = async (req, res) => {
  const { branch } = req.employee;
  const pageSize = req.query.pageSize;
  const currentPage = req.query.currentPage || 0;

  let [orders, ordersCount] = await Promise.all([
    Order.find({ branch })
      .populate("customer")
      .populate("branch")
      .skip(currentPage)
      .limit(pageSize),
    Order.find({ branch }).count(),
  ]);

  res.send({ pageSize, orders, ordersCount, currentPage });
};

const getBranchPendingOrders = async (req, res) => {
  const { branch } = req.employee;

  let pendingOrders = await Order.find({ branch, "status.value": 0 }).count();

  res.send({ pendingOrders: pendingOrders });
};

const getOrder = async (req, res) => {
  let order = await Order.findById(req.params.id)
    .populate("customer")
    .populate("branch")
    .populate("payment_method");

  if (!order) return res.status(404).send("Order not found.");

  res.send(order);
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
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { comment, delivered_at, riderId } = req.body;

  const order = await Order.findById(req.params.id);

  if (comment) order.comment = comment;
  if (delivered_at) order.delivered_at = delivered_at;
  if (riderId) order.rider = riderId;
  if (confirmed_at) order.confirmed_at = confirmed_at;

  await order.save();

  res.send(order);
};

const updateOnOpen = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order not found.");

  order.status.value = 1;
  order.status.update_at = Date.now();
  res.send(order.status);

  //todo: send notification
};

const dispatchOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order not found.");

  order.rider = req.body.riderId;
  order.status.value = 2;
  order.status.update_at = Date.now();

  res.send(order);
};

module.exports = {
  createOrder,
  dispatchOrder,
  getBranchOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  updateOrder,
  getCustomerOrders,
  updateOnOpen,
  getBranchPendingOrders,
};
