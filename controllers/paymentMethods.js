const _ = require("lodash");
const { PaymentMethod, validate } = require("../models/PaymentMethod");

const createPaymentMethod = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingPaymentMethod = await PaymentMethod.findOne({
    name: req.body.name,
  }).count();
  if (existingPaymentMethod)
    return res
      .status(409)
      .send("Payment method with the given name already exists.");

  const paymentMethod = new PaymentMethod(_.pick(req.body, ["name"]));

  await paymentMethod.save();

  res.send(paymentMethod);
};

const getPaymentMethods = async (req, res) => {
  const paymentMethods = await PaymentMethod.find().sort("name");

  res.send(paymentMethods);
};

const updatePaymentMethod = async (req, res) => {
  const paymentMethod = await PaymentMethod.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["name"]),
    },
    { new: true }
  );

  if (!paymentMethod) return res.status(404).send("Payment Method not found.");

  res.send(paymentMethod);
};

const deletePaymentMethod = async (req, res) => {
  const paymentMethod = await PaymentMethod.findByIdAndRemove(req.params.id);

  if (!paymentMethod) return res.status(404).send("Payment Method not found.");

  res.send(paymentMethod);
};

module.exports = {
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
};