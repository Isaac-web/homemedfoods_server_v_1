const { Branch, validate, validateOnUpdate } = require("../models/Branch");

const createBranch = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { area, city, coordinates, description, name } = req.body;

  const branch = new Branch({
    name,
    description,
    address: {
      city,
      area,
      coordinates,
    },
  });

  await branch.save();

  res.send(branch);
};

const getBranch = async (req, res) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) return res.status(404).send("Branch not found.");

  res.send(branch);
};

const getBranches = async (req, res) => {
  const filter = {};
  if (req.query.name) filter.name = new RegExp(req.query.name, 'i');

  const branches = await Branch.find(filter);

  res.send(branches);
};

const updateBranch = async (req, res) => {
  const { error } = await validateOnUpdate(req.bdoy);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, description, city, area, coordinates } = req.body;

  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(404).send("Branch not found.");

  if (name) branch.name = name;
  if (description) branch.description = description;
  if (city) branch.address.city = city;
  if (area) branch.address.area = area;
  if (coordinates) branch.address.coordinates;

  await branch.save();

  res.send(branch);
};

const deleteBranch = async (req, res) => {
  const branch = await Branch.findByIdAndRemove(req.params.id);

  if (!branch) return res.status(404).send("Branch not found.");

  res.send(branch);
};

const closeBranch = async (req, res) => {
  const employee = req.employee;

  if (employee.userType === "employee")
    if (employee.branch.toHexString() !== req.params.id)
      return res
        .status(400)
        .send("Looks like you are not related to the given branch.");

  const branch = await Branch.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isOpen: false,
      },
    },
    { new: true }
  );

  if (!branch)
    return res.status(404).send("Looks like the branch cannot be found.");

  res.send(branch);
};

const openBranch = async (req, res) => {
  const employee = req.employee;

  if (employee.userType === "employee")
    if (employee.branch.toHexString() !== req.params.id)
      return res
        .status(400)
        .send("Looks like you are not related to the given branch.");

  const branch = await Branch.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isOpen: true,
      },
    },
    { new: true }
  );

  if (!branch)
    return res.status(404).send("Looks like the branch cannot be found.");

  res.send(branch);
};

module.exports = {
  createBranch,
  getBranch,
  getBranches,
  updateBranch,
  deleteBranch,
  closeBranch,
  openBranch,
};