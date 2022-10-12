const _ = require("lodash");
const { Address, validate, validateOnUpdate } = require("../models/Address");

const createAddress = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const address = new Address(
    _.pick(req.body, ["coordinates", "area", "digitalAddress"])
  );

  address.userId = req.customer._id;

  await address.save();

  res.send(address);
};

const getAddresses = async (req, res) => {
  const address = await Address.find({ userId: req.customer._id });
  res.send(address);
};

const updateAddress = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const address = await Address.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["coordinates", "area", "area", "digitalAddress"]),
    },
    { new: true }
  );

  if (!address) return res.status(404).send("Address not found.");

  res.send(address);
};

const deleteAddress = async (req, res) => {
  const address = await Address.findByIdAndRemove(req.params.id);

  if (!address) return res.status(404).send("Address not found.");

  res.send(address);
};

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};
