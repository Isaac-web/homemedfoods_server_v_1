const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid");
const { Address } = require("./Address");
const { addressSchema } = require("./Address");


//address, digital address, imageUri, branch
const emailValidationRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true,
  },
  middlename: {
    type: String,
    maxlength: 50,
    trim: true,
  },
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    minlength: 7,
    maxlength: 100,
    regex: emailValidationRegex,
    trim: true,
    required: true,
    createIndex: true,
  },
  password: {
    type: String,
    minlength: 7,
    maxlength: 1024,
    required: true,
  },
  address: {
    type: String,
    maxlength: 256,
    required: true,
    trim: true,
  },
  digitalAddress: {
    type: String,
    maxlength: 100,
    trim: true,
  },
  phone: {
    type: String,
    minlength: 3,
    maxlength: 15,
    createIndex: true,
    required: true,
    trim: true,
  },
  imageUri: {
    type: String,
    maxlength: 1024,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
    required: true,
  },
  verificationStage: {
    type: Number,
    min: 0,
    max: 2,
    default: 0,
  },
  dateCommenced: Date,
  lastSeen: Date,
});

employeeSchema.methods.verifyRequiredData = async function () {
  const validData =
    this.firstname &&
    this.lastname &&
    this.dataOfBirth &&
    this.email &&
    this.password &&
    this.address &&
    this.phone &&
    this.station &&
    this.designation;

  if (validData && this.verificationStage < 1) {
    this.verificationStage = this.verificationStage + 1;
    await this.save();
  }
};

const Employee = mongoose.model("Employee", employeeSchema);

const validate = (employee) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(256).required(),
    middlename: Joi.string().max(256),
    lastname: Joi.string().min(2).max(256).required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().min(0).max(256).required(),
    phone: Joi.string().min(3).max(15).required(),
    address: Joi.string().max(256).required(),
    digitalAddress: Joi.string().max(100).required(),
    password: Joi.string().min(7).max(256).required(),
    confirmPassword: Joi.string().min(7).max(256).required(),
  });

  return schema.validate(employee);
};

const validateOnUpdate = (employee) => {
  const schema = Joi.object({
    firstname: Joi.string().max(50),
    middlename: Joi.string().max(50),
    lastname: Joi.string().max(50),
    dateOfBirth: Joi.date(),
    image: Joi.string().max(1024),
    designationId: Joi.objectId(),
    branchId: Joi.objectId(),
    phone: Joi.string().max(15),
    address: Joi.object(),
    dateCommenced: Joi.date(),
    lastSeen: Joi.date(),
  });

  return schema.validate(employee);
};

exports.Employee = Employee;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
