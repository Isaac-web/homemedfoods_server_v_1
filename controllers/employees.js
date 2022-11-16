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

  employee.password = undefined;

  res.send(employee);
};

const updateEmployee = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const [designation, branch] = await Promise.all([
    Designation.findById(req.body.designationId),
    Branch.findById(req.body.branchId),
  ]);

  if (!designation) return res.status(404).send("Designation not found.");
  if (!branch) return res.status(404).send("Branch not found.");

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middlename: req.body.middlename,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        phone: req.body.phone,
        salary: req.body.salary,
        address: req.body.address,
        designation: designation,
        branch: branch,
        digitalAddress: req.body.digitalAddress,
      },
    },
    { new: true }
  );

  if (!employee) return res.status(404).send("Employee not found.");

  res.send(employee);
};

const deleteEmployee = async (req, res) => {
  let employee = Employee.findByIdAndRemove(req.params.id);
  if (!employee) return res.status(404).send("Employee not found.");
  employee.password = undefined;
  res.send(employee);
};

const createEmployee = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const [designation, branch] = await Promise.all([
    Designation.findById(req.body.designationId),
    Branch.findById(req.body.branchId),
  ]);

  if (!designation) return res.status(404).send("Designation not found.");
  if (!branch) return res.status(404).send("Branch not found.");

  const employee = new Employee({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    middlename: req.body.middlename,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    phone: req.body.phone,
    salary: req.body.salary,
    address: req.body.address,
    designation: designation,
    branch: branch,
    digitalAddress: req.body.digitalAddress,
  });

  await employee.save();

  res.send(employee);
};

module.exports = {
  register,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  createEmployee,
};