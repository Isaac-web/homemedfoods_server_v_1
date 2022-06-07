const _ = require("lodash");
const { Discount, validate, validateOnUpdate } = require("../models/Discount");

const createDiscount = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const discount = new Discount(
    _.pick(req.body, ["name", "desc", "discountPercent", "isActive"])
  );

  await discount.save();

  res.send(discount);
};

const getAllDiscounts = async (req, res) => {
  const discounts = await Discount.find();

  res.send(discounts);
};

const getDiscount = async (req, res) => {
  const discount = await Discount.findById(req.params.id);

  if (!discount) return res.status(404).send("Discount not found.");

  res.send(discount);
};

const updateDiscount = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const discount = await Discount.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["name", "desc", "discountPercent", "isActive"]),
    },
    { new: true }
  );

  if (!discount) return res.status(404).send("Discount not found.");

  res.send(discount);
};

const deleteDiscount = async (req, res) => {
  const discount = await Discount.findByIdAndRemove(req.params.id);

  if (!discount) return res.status(404).send("Discount not found.");

  res.send(discount);
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
