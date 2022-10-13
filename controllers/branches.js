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
  const branches = await Branch.find();

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

module.exports = {
  createBranch,
  getBranch,
  getBranches,
  updateBranch,
  deleteBranch,
};