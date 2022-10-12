const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { orderItemSchema } = require("../models/OrderItem");

const deliveryAddressSchema = new mongoose.Schema({
  coordinates: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: {
    value: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    updated_at: {
      type: Date,
      default: function () {
        return Date.now();
      },
    },
  },
  comment: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  delivered_at: {
    type: Date,
    defalut: null,
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  order_items: {
    type: [orderItemSchema],
    required: true,
    valdiate: {
      validator: function (order) {
        return Boolean(order.length);
      },
      message: "Order should have at least one item.",
    },
  },
  delivery_address: {
    type: deliveryAddressSchema,
    required: true,
  },
  payment_method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: true,
  },
  total: {
    type: Number,
    min: 0,
    validate: {
      validator: function (total) {
        return total > 0;
      },
      message: "Tatal should be greater than 0",
    },
  },
});

orderSchema.method.updateStatus = function () {
  console.log("update...");
};

const Order = mongoose.model("Order", orderSchema);

const validate = (order) => {
  const schema = Joi.object({
    customer: Joi.objectId().required(),
    comment: Joi.string().max(500),
    order_items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.objectId().required(),
          quantity: Joi.number().min(1),
        })
      )
      .required(),
    delivery_address: Joi.object({
      coordinates: Joi.object({
        lat: Joi.number().required(),
        long: Joi.number().required(),
      }),
    }).required(),
    payment_method_id: Joi.objectId().required(),
    total: Joi.number().min(0).greater(0),
  });

  return schema.validate(order);
};

const validateOnUpdate = (order) => {
  const schema = Joi.object({
    comment: Joi.string().max(500),
    riderId: Joi.objectId(),
    delivered_at: Joi.date(),
  });

  return schema.validate(order);
};

exports.Order = Order;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
