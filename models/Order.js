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
    required: true,
  },
  order_items: {
    type: Array,
    deafult: [orderItemSchema],
  },
  delivery_address: {
    type: deliveryAddressSchema,
    required: true,
  },
  payment_method: {
    type: String,
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
      coordinate: Joi.object({
        lat: Joi.number().required(),
        long: Joi.number().required(),
      }),
    }).required(),
    payment_method: Joi.string().required(),
    total: Joi.number().min(0).greater(0),
  });

  return schema.validate(order);
};

exports.Order = Order;
exports.validate = validate;
