const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
Joi.objectId = require("joi-objectid");

//address, digital address, imageUri, branch
const emailValidationRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    minlength: 2,
    maxlength: 50,
    enum: ["system", "employee"],
  },
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
    required: this.userType === "employee",
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
  },
  address: {
    type: String,
    maxlength: 256,
    required: this.userType === "employee",
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
    required: this.userType === "employee",
    trim: true,
  },
  salary: {
    type: Number,
    min: 0,
    required: this.userType === "employee",
  },
  imageUri: {
    type: String,
    maxlength: 1024,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: this.userType === "employee",
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
    required: this.userType === "employee",
  },
  verificationStage: {
    type: Number,
    min: 0,
    max: 2,
    default: 0,
  },
  dateCommenced: {
    type: Date,
    required: this.userType === "employee",
  },
  lastSeen: Date,
  device: {
    token: String,
  },
});

userSchema.methods.verifyRequiredData = async function () {
  const validData =
    this.firstname &&
    this.lastname &&
    this.dataOfBirth &&
    this.email &&
    this.password &&
    this.address &&
    this.phone &&
    this.station &&
    this.salary &&
    this.designation;

  if (validData && this.verificationStage < 1) {
    this.verificationStage = this.verificationStage + 1;
    await this.save();
  }
};

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    name: `${this.firstname} ${this.lastname || ""}`,
    email: this.email,
    userType: this.userType,
  };
  if (this.userType === "employee") {
    payload.designation = this.designation.value;
    payload.branchId = this.branch;
  }

  //generate and return token
  return jwt.sign(payload, config.get("auth.privateKey"));
};

const User = mongoose.model("User", userSchema);

const validate = (employee) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(256).required(),
    middlename: Joi.string().min(0).max(256),
    lastname: Joi.string().min(2).max(256).required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().min(7).max(256).required(),
    phone: Joi.string().min(3).max(15).required(),
    salary: Joi.number().min(0).required(),
    address: Joi.string().max(256).required(),
    designationId: Joi.string().required(),
    imageUri: Joi.string().min(0),
    branchId: Joi.string().required(),
    digitalAddress: Joi.string().min(0).max(100).required(),
    password: Joi.string().min(7).max(128).required(),
    confirmPassword: Joi.string().min(7).max(128).required(),
  });

  return schema.validate(employee);
};

const validateOnUpdate = (employee) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(256).required(),
    middlename: Joi.string().min(0).max(256),
    lastname: Joi.string().min(2).max(256).required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().min(0).max(256),
    phone: Joi.string().min(3).max(15).required(),
    salary: Joi.number().min(0).required(),
    address: Joi.string().max(256).required(),
    designationId: Joi.string().required(),
    imageUri: Joi.string().min(0),
    branchId: Joi.string().required(),
    digitalAddress: Joi.string().min(0).max(100).required(),
    password: Joi.string().min(7).max(128).required(),
    confirmPassword: Joi.string().min(7).max(128).required(),
  });

  return schema.validate(employee);
};

const validateSystemUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstname: Joi.string().max(50),
    lastname: Joi.string().max(50),
    imageUri: Joi.string().max(1024),
    password: Joi.string().min(10).max(128).required(),
    confirmPassword: Joi.string().min(10).max(128).required(),
  });

  return schema.validate(user);
};

const validateSystemUserOnUpdate = (user) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    firstname: Joi.string().max(50).required(),
    lastname: Joi.string().max(50).required(),
    imageUri: Joi.string().max(1024),
  });

  return schema.validate(user);
};

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(128).required(),
    notificationToken: Joi.string().optional(),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validate;
exports.validateLogin = validateLogin;
exports.validateOnUpdate = validateOnUpdate;
exports.validateSystemUser = validateSystemUser;
exports.validateSystemUserOnUpdate = validateSystemUserOnUpdate;
