const { Designation, validate } = require("../models/Designation");
const _ = require("lodash");
const { User } = require("../models/User");

const createDesignation = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const designation = new Designation(_.pick(req.body, ["value"]));
  await designation.save();

  res.send(designation);
};

const getDesignations = async (req, res) => {
  const designations = await Designation.find();

  res.send(designations);
};

const updateDesignation = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const designation = await Designation.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["value"]),
    },
    { new: true }
  );

  if (!designation) return res.status(404).send("Designation not found.");

  res.send(designation);
};

const deleteDesignation = async (req, res) => {
  const [designation, designationUsed] = await Promise.all([
    Designation.findByIdAndRemove(req.params.id),
    User.findOne({ designation: req.params.id }),
  ]);

  if (designationUsed)
    return res
      .status(402)
      .send("The given designation is currently in use and cannot be deleted.");

  if (!designation) return res.status(404).send("Designation not found.");

  res.send(designation);
};

module.exports = {
  createDesignation,
  getDesignations,
  updateDesignation,
  deleteDesignation,
};
