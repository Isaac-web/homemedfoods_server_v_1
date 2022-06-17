const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const emailValidationRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 2,
    maxlength: 256,
    trim: true,
    required: true,
  },
  middlename: {
    type: String,
    maxlength: 256,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 256,
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
    maxlength: 256,
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
    //to be updated
  },
  image: {
    type: String,
    maxlength: 1024,
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  designation: {
    type: String,
    //to be updated
  },
  verificationStage: {
    type: Number,
    min: 0,
    max: 2,
    default: 0,
  },
  dateCommenced: {
    type: Date,
  },
  lastSeen: Date,
});

employeeSchema.methods.verifyStatus = async function () {
  const validData =
    this.firstname &&
    this.lastname &&
    this.dataOfBirth &&
    this.email &&
    this.password &&
    this.address &&
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
    password: Joi.string().min(7).max(256).required(),
    confirmPassword: Joi.string(7).max(256).required(),
    designationId: Joi.objectId(),
    stationId: Joi.objectId().required(),
  });

  return schema.validate(employee);
};

const validateOnUpdate = (employee) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(256),
    lastname: Joi.string().min(2).max(256),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().email().required(),
    image: Joi.string().max(1024),
    address: {
      line_1: Joi.string(),
      line_2: Joi.string(),
      cityId: Joi.objectId(),
      coordinates: Joi.object(),
    },
  });

  return schema.validate(employee);
};

exports.Employee = Employee;
exports.validate = validate;
exports.validateOnUpdate = validateOnUpdate;
