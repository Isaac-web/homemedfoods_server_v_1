const _ = require('lodash');
const bcrypt = require('bcrypt');
const {
  Customer,
  validate,
  validateAuth,
  validateOnUpdate,
  validateOnResetPassword,
} = require('../models/Customer');
const { CustomerNotification } = require('../models/CustomerNotification');
const { Order } = require('../models/Order');
const { OTP } = require('../models/OTP');
const { sendSms } = require('../utils/sms');

const register = async (req, res) => {
  //For now, email customer will be logged in automatically
  //without having to verify his/her email
  //Todo: Implement email verification

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send('Passwords donnot match.');

  let customer = await Customer.findOne({ email: req.body.email });
  if (customer) return res.status(400).send('Email is already taken.');

  customer = new Customer(
    _.pick(req.body, ['firstname', 'lastname', 'phone', 'email'])
  );

  //hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  customer.password = hashedPassword;

  if (req.body.notificationToken) {
    customer.devices.push({
      notificationData: {
        token: req.body.notificationToken,
      },
    });
  }

  //generate and send otp to user
  const otp = OTP({ phone: customer.phone });

  await Promise.all([
    customer.save(),
    sendSms(otp.phone, `${otp.pin} is your Digimart verification code.`),
    otp.save(),
  ]);

  customer.password = undefined;
  const token = customer.generateAuthToken();
  res.header('x-auth-token', token).send(customer);
};

const login = async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(404).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(
    req.body.password,
    customer.password
  );

  if (!validPassword) return res.status(400).send('Invalid email or password.');

  if (req.body.notificationToken) {
    if (customer.devices && customer.devices.length)
      customer.devices[0].notificationData = {
        token: req.body.notificationToken,
        appName: req.body.appName,
      };
    else {
      customer.devices = [
        {
          notificationData: {
            token: req.body.notificationToken,
            appName: req.body.appName,
          },
        },
      ];
    }
  }
  await customer.save();

  customer.password = undefined;

  const token = customer.generateAuthToken();
  res.json({ token, customer });
};

const getCustomers = async (req, res) => {
  const { name } = req.query;

  let filter = {};
  if (name) {
    filter = {
      ...filter,
      $or: [{ firstname: RegExp(name, 'i') }, { lastname: RegExp(name, 'i') }],
    };
  }

  const [customers, count] = await Promise.all([
    Customer.find(filter),
    Customer.find(filter).count(),
  ]);

  res.send({ customers, count });
};

const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.customer._id);
  if (!customer) return res.status(404).send('Customer not found.');

  res.send(customer);
};

const updateCustomer = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.customer._id,
    {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
      },
    },
    { new: true }
  );

  if (!customer) return res.status(404).send('Customer not found.');

  res.send(customer);
};

const resetPassword = async (req, res) => {
  const { error } = validateOnResetPassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send('Passwords donnot match.');

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  await Customer.findByIdAndUpdate(req.customer._id, {
    $set: {
      password: hashedPassword,
    },
  });

  res.send({ message: 'Password has been updated.' });
};

const deleteCustomer = async (req, res) => {
  const [customer] = await Promise.all([
    Customer.findByIdAndRemove(req.customer._id),
    CustomerNotification.deleteMany({ userId: req.customer._id }),
    Order.deleteMany({ customer: req.customer._id }),
  ]);

  res.send(customer);
};

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  resetPassword,
  register,
  login,
};
