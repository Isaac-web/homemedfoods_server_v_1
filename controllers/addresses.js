const { Employee } = require("../models/Employee");
const { Address, validate } = require("../models/Address");
const validateObjectId = require("../utils/validateObjectId");
const mongoose = require("mongoose");

const createAddress = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  let { userType, id: userId } = req.params;
  userType = userType.toLowerCase();
  switch (userType) {
    case "employee":
      user = await Employee.findById(userId);
      break;
    default:
      user = null;
  }

  if (!user) return res.status(404).send("User not found.");

  const address = new Address({
    user: user._id,
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    line_3: req.body.line_3,
    city: req.body.city,
    coordinates: req.body.coordinates,
  });

  await address.save();

  res.send(address);
};

const getAddresses = async (req, res) => {
  const { userId } = req.params;

  const isValidId = validateObjectId(userId);
  if (!isValidId) return res.status(400).send("Invalid ObjectId");

  const addresses = await Address.find({ user: userId });

  res.send(addresses);
};

const updateAddress = async (req, res) => {
  const address = await Address.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        line_1: req.body.line_1,
        line_2: req.body.line_2,
        line_3: req.body.line_3,
        city: req.body.cityId,
        coordinates: req.body.coordinates,
      },
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
