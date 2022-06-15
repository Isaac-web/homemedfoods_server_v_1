const _ = require("lodash");
const { Employee, validate } = require("../models/Employee");
const bcrypt = require("bcrypt");
const Station = require("../models/Station");

const createEmployee = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const passwordsMatch = req.body.password === req.body.confirmPassword;
  if (!passwordsMatch) return res.status(400).send("Passwords donnot match.");

  let employee = await Employee.findOne({ email: req.body.email });

  let station = Station.findById(req.body.stationId);
  //look up the designation by its id
  [station] = await Promise.all([station]);

  if (!station) return res.status(404).send("Station not found.");

  employee = new Employee(
    _.pick(req.body, [
      "firstname",
      "middlename",
      "lastname",
      "email",
      "dateOfBirth",
      "stationId",
      "designationId",
    ])
  );

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = bcrypt.hash(req.body.password, salt);
  employee.password = hashedPassword;

  await employee.save();

  res.send(employee);
};

const getEmployees = async (req, res) => {
  const employees = await Employee.find();

  res.send(employees);
};

const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) return res.status(404).send("Employee not found.");

  res.send(employee);
};

const updateEmployee = async (req, res) => {
  //validate inputs
  //look up the necessary documents
  //make updates
  //respond to the user
  res.send("Not implemented.");
};

const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndRemove(req.params.id);

  if (!employee) return res.status(404).send("Employee not found.");

  res.end(employee);
};

const inviteEmpolyee = async (req, res) => {
  res.send("To be implemented");
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  inviteEmpolyee,
};
