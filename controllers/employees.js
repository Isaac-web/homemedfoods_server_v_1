const _ = require("lodash");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { Employee, validate, validateOnUpdate } = require("../models/Employee");
const { Invitation } = require("../models/Invitation");
const { Station } = require("../models/Station");
const { Branch } = require("../models/Branch");
const { Designation } = require("../models/Designation");

const register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("Passwords donnot match.");

  const { invitationId } = req.query;
  const invitation = await Invitation.findById(invitationId);
  if (!invitation) return res.status(404).send("Invitation not found.");

  const isExpired = Date.now() > Date.parse(invitation.expiresAt);
  if (isExpired)
    return res.status(409).send("Sorry. Your invitation has expired.");

  const now = moment(new Date());
  const dateOfBirth = moment(new Date(req.body.dateOfBirth));
  const isAdult = now.diff(dateOfBirth, "years") >= 16;
  if (!isAdult)
    return res.status(400).send("You have to be 16 years or above.");

  let employee = await Employee.findById(invitation.employeeId);
  if (employee)
    return res.status(409).send("Employee with given id already exists.");

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  employee = new Employee({
    _id: invitation.employeeId,
    firstname: req.body.firstname,
    middlename: req.body.middlename,
    lastname: req.body.lastname,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    password: hashedPassword,
    station: invitation.station,
    designation: invitation.designation,
  });

  // console.log(invitation);
  // res.send(invitation.branch);

  let branch = Branch.findById(invitation.branch);
  let designation = Designation.findById(invitation.designation);

  [branch, designation] = await Promise.all([branch, designation]);
  employee.branch = branch;
  employee.designation = designation;
  
  await employee.save();

  // remove password from response body
  employee.password = undefined; 
  res.send(employee);
};

const getEmployees = async (req, res) => {
  const employees = await Employee.find()
    .populate("branch")
    .populate("designation");

  res.send(employees);
};

const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate("branch")
    .populate("designation");

  res.send(employee);
};

const updateEmployee = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.params.id)
    .populate("station")
    .populate("designation");

  if (!employee) return res.status(404).send("Employee not found.");

  employee.set(
    _.pick(req.body, [
      "firstname",
      "middlename",
      "lastname",
      "dateOfBirth",
      "image",
      "address"
    ])
  );
    

  if (req.body.designationId) {
    const designation = await Designation.findById(req.body.designationId);
    if (!designation) return res.status(404).send("Desination not found.");

    employee.designation = designation;
  }

  if (req.body.stationId) {
    const station = await Station.findById(req.body.stationId);
    if (!station) return res.status(404).send("Station not found.");

    employee.station = station;
  }

  await employee.save();

  employee.password = undefined;
  res.send(employee);
};

const deleteEmployee = async (req, res) => {
  let employee = Employee.findByIdAndRemove(req.params.id);
  let invitation = Invitation.remove({ employeeId: req.params.id });

  [employee] = await Promise.all([employee, invitation]);

  if (!employee) return res.status(404).send("Employee not found.");

  delete employee.password;
  res.send(employee);
};

module.exports = {
  register,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};