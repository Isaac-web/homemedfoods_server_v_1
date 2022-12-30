const { Branch } = require("../models/Branch");
const { Order, validate, validateOnUpdate } = require("../models/Order");
const { PaymentMethod } = require("../models/PaymentMethod");
const { User } = require("../models/User");
const { CustomerNotification } = require("../models/CustomerNotification");
const generateOrderId = require("../utils/generateOrderId");
const { Coupon } = require("../models/Coupon");

const createOrder = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const [branch, paymentMethod, coupon] = await Promise.all([
    Branch.findById(req.body.branch),
    PaymentMethod.findById(req.body.payment_method_id),
    Coupon.findOne({ code: req.body.couponCode }),
  ]);

  if (!branch) return res.status(404).send("Branch not found.");
  if (!paymentMethod) return res.status(404).send("Payment method not found.");

  let orderItemsTotal = 0;
  const orderItems = req.body.order_items.map((item) => {
    let subtotal = 0;
    const orderItem = {
      productId: item.productId,
      productName: item.productName,
      optionalPrice: item.optionalPrice,
      unitPrice: item.unitPrice,
      imageUri: item.imageUri,
      quantity: item.quantity,
      subtotal: (subtotal += item.optionalPrice
        ? item.optionalPrice * item.quantity
        : item.unitPrice * item.quantity),
    };
    orderItemsTotal += subtotal;
    return orderItem;
  });

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

  if (req.body.couponCode && !coupon)
    return res.status(404).send("Looks like the coupon used cannot be found.");

  if (coupon) {
    if (!coupon.active)
      return res
        .status(400)
        .send(
          "The coupon provided is currently deactivated and cannot be used."
        );

    if (new Date(coupon.expiresAt).getTime() < Date.now())
      // return 400 if coupon is expired.
      return res.status(400).send("The coupon provided is expired.");

    if (coupon.usedBy.indexOf(req.customer._id) > -1)
      //return 400 if coupon has already been used.
      return res.status(400).send("Coupon has already been used.");

    order.total = Math.max.apply(null, [0, order.total - coupon.amount]);
    coupon.usedBy = [...coupon.usedBy, req.customer._id];

    await coupon.save();
  }

  order.orderId = generateOrderId(order._id, req.customer._id);

  await order.save();

  res.send(order);
};

const getOrders = async (req, res) => {
  const pageSize = req.query.pageSize;
  const currentPage = req.query.currentPage || 0;

  let [orders, ordersCount] = await Promise.all([
    Order.find()
      .populate("customer")
      .populate("branch")
      .skip(currentPage)
      .limit(pageSize),
    Order.find().count(),
  ]);

  res.send({ pageSize, orders, ordersCount, currentPage });
};

const getBranchOrders = async (req, res) => {
  const { branch } = req.employee;
  const pageSize = req.query.pageSize;
  const currentPage = req.query.currentPage || 0;
  const { status } = req.query;

  const filter = {};
  if (branch) filter.branch = branch;
  if (status) filter["status.value"] = parseInt(status);

  let [orders, ordersCount] = await Promise.all([
    Order.find(filter)
      .populate("customer")
      .populate("branch")
      .skip(currentPage)
      .limit(pageSize),
    Order.find(filter).count(),
  ]);

  res.send({ pageSize, orders, ordersCount, currentPage });
};

const getBranchPendingOrders = async (req, res) => {
  const { branch } = req.employee || {};
  const status = req.query.status;

  const filter = {};
  if (branch) filter.branch = branch;
  if (status) filter["status.value"] = status;

  let pendingOrders = await Promise.all([
    Order.find(filter).count(), 
  ]);

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
  const orders = await Order.find({ customer: req.customer._id });

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

const updateOrderProcess = async (req, res) => {
  if (!req.body.shopperId)
    return res.status(400).send("shopperId is required.");
  if (!req.body.riderId) return res.status(400).send("riderId is required.");

  const shopper = await User.findById(req.body.shopperId);
  if (!shopper)
    return res.status(404).send("Looks like the shopper cannot be found.");
  const rider = await User.findById(req.body.riderId);
  if (!rider)
    return res.status(404).send("Looks like the rider cannot be found.");

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "status.value": 1,
        "status.updated_at": Date.now(),
        shopper: shopper,
        rider: rider,
      },
    },
    { new: true }
  );

  if (!order)
    return res.status(404).send("Looks like the order cannot be found.");

  const notification = new CustomerNotification({
    userId: order.customer,
    title: "Status Update",
    text: "Your order is being processed. It will get to you soon. Thank you for shopping with us.",
  });

  await notification.save();

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
  updateOrderProcess,
};
