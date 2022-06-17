const _ = require("lodash");
const { Designation, validate } = require("../models/Designation");
const { Employee } = require("../models/Employee");

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
  if (error) return res.status(error.details[0].message);

  const desination = await Designation.findByIdAndUpdate(
    req.params.id,
    { $set: _.pick(req.body, ["value"]) },
    { new: true }
  );

  res.send(desination);
};

const deleteDesignation = async (req, res) => {
  let employee = Employee.findOne({ designation: req.params.id });
  let designation = Designation.findById(req.params.id);

  [employee, desination] = await Promise.all([employee, designation]);

  if (employee) return res.status(409).send("Cannot delete this desination.");

  if (designation?.value?.toLowerCase() == "system")
    return res.status(409).send("Cannot Delete system user.");

  designation = await Designation.findByIdAndRemove(req.params.id);

  res.send(designation);
};

module.exports = {
  createDesignation,
  getDesignations,
  updateDesignation,
  deleteDesignation,
};
