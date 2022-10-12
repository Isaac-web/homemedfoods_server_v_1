const mongoose = require("mongoose");
const Joi = require("joi");

const PaymentMethod = mongoose.model(
  "PaymentMethod",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
      createIndex: true,
    },
  })
);

const validate = (paymentMethod) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(paymentMethod);
};

exports.PaymentMethod = PaymentMethod;
exports.validate = validate;
