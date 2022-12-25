const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  Customer,
  validate,
  validateAuth,
  validateOnUpdate,
} = require("../models/Customer");
const { ShoppingCart } = require("../models/ShoppingCart");
const { CustomerNotification } = require("../models/CustomerNotification");
const { Order } = require("../models/Order");

const register = async (req, res) => {
  //For now, email customer will be logged in automatically
  //without having to verify his/her email
  //Todo: Implement email verification

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("Passwords donnot match.");

  let customer = await Customer.findOne({ email: req.body.email });
  if (customer) return res.status(400).send("Email is already taken.");

  customer = new Customer(
    _.pick(req.body, ["firstname", "lastname", "phone", "email"])
  );

  //hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  customer.password = hashedPassword;

  //create a shopping cart for the customer
  const shoppingCart = new ShoppingCart({
    _id: customer._id,
    userId: customer._id,
  });

  await Promise.all([customer.save(), shoppingCart.save()]);

  customer.password = undefined;
  const token = customer.generateAuthToken();
  res.header("x-auth-token", token).send(customer);
};

const login = async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(404).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(
    req.body.password,
    customer.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = customer.generateAuthToken();
  res.json({ token });
};

const getCustomers = async (req, res) => {
  const customers = await Customer.find();

  res.send(customers);
};

const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.customer._id);
  if (!customer) return res.status(404).send("Customer not found.");

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

  if (!customer) return res.status(404).send("Customer not found.");

  res.send(customer);
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
  register,
  login,
};
