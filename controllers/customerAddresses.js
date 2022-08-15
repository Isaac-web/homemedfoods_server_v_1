const {
  CustomerAddress,
  validate,
  validateOnUpdate,
} = require("../models/CustomerAddress");
const _ = require("lodash");

const addAddress = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customerAddress = CustomerAddress(
    _.pick(req.body, [
      "line_1",
      "line_2",
      "line_3",
      "suburb",
      "city",
      "digitalAddress",
      "coords",
    ])
  );

  customerAddress.customerId = req.customer._id;

  await customerAddress.save();

  res.send(customerAddress);
};

const getCustomerAddresses = async (req, res) => {
  const addresses = await CustomerAddress.find({
    customerId: req.customer._id,
  });

  res.send(addresses);
};

const updateAddress = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const address = await CustomerAddress.findOneAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "line_1,",
        "line_2",
        "line_3",
        "suburb",
        "city",
        "digitalAddress",
        "coords",
      ]),
    },
    { new: true }
  );

  if (!address) return res.status(404).send("Address not found.");

  res.send(address);
};

const deleteCustomerAddress = async (req, res) => {
  const address = await CustomerAddress.findByIdAndRemove(req.params.id);

  if (!address) return res.status(404).send("Address not found.");

  res.send(address);
};

module.exports = {
  addAddress,
  getCustomerAddresses,
  updateAddress,
  deleteCustomerAddress,
};
