const {
  User,
  validate,
  validateSystemUser,
  validateLogin,
  validateOnUpdate,
  validateSystemUserOnUpdate,
} = require("../models/User");
const bcrypt = require("bcrypt");
const { Branch } = require("../models/Branch");
const { Designation } = require("../models/Designation");

const createUser = async (req, res) => {
  const userCount = await User.find().count();

  const isSystemUser = !userCount || req.query.userType === "system";
  const { error } = isSystemUser
    ? validateSystemUser(req.body)
    : validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("Passwords donnot match.");

  if (userCount) {
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("This email is used by another user.");
  }

  let user;
  if (isSystemUser) {
    user = new User({
      userType: "system",
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      imageUri: req.body.imageUri,
    });
  } else {
    //find the branch and the designation
    const [branch, designation] = await Promise.all([
      Branch.findById(req.body.branchId),
      Designation.findById(req.body.designationId),
    ]);

    //verify if branch and designation exists
    if (!branch) return res.status(404).send("Branch not found.");
    if (!designation) return res.status(404).send("Designation not found.");

    //create the user
    user = new User({
      userType: req.query.userType || "employee",
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      address: req.body.address,
      digitalAddress: req.body.digitalAddress,
      phone: req.body.phone,
      salary: req.body.salary,
      imageUri: req.body.imageUri,
      branch: branch,
      designation: designation,
    });
  }

  const salt = await bcrypt.genSalt(12);
  password = await bcrypt.hash(req.body.password, salt);
  user.password = password;

  await user.save();

  user.password = undefined;
  res.status(201).send(user);
};

const getUsers = async (req, res) => {
  const { userType, branchId, pageSize, q, designationId } = req.query;
  const currentPage = req.query.currentPage || 0;

  const filter = {};
  if (userType) filter.userType = userType;
  if (userType === "employee" && branchId) filter.branchId = branchId;
  if (userType === "employee" && designationId)
    filter.designation = designationId;

  if (q) {
    let searchString = new RegExp(q, "i");
    filter.$or = [
      { firstname: searchString },
      { lastname: searchString },
      { email: searchString },
    ];
  }

  const [users, count] = await Promise.all([
    User.find(filter)
      .populate("branch")
      .populate("designation")
      .select("-password")
      .skip(currentPage * pageSize || 0)
      .limit(pageSize),
    User.find().count(),
  ]);

  res.send({ users, count, currentPage, pageSize });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("branch")
    .populate("designation")
    .select("-password");

  if (!user) return res.status(404).send("User not found.");

  res.send(user);
};

const updateUser = async (req, res) => {
  const { userType } = req.query;
  const { error } =
    userType === "system"
      ? validateSystemUserOnUpdate(req.body)
      : validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.params.id)
    .populate("branch")
    .populate("designation")
    .select("-password");
  if (!user) return res.status(404).send("User not found.");

  if (user.userType === "system") {
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.imageUri = req.body.imageUri;
  } else {
    //find the branch and the designation
    const [branch, designation] = await Promise.all([
      Branch.findById(req.body.branchId),
      Designation.findById(req.body.designationId),
    ]);

    //verify if branch and designation exists
    if (!branch) return res.status(404).send("Branch not found.");
    if (!designation) return res.status(404).send("Designation not found.");

    user.firstname = req.body.firstname;
    user.middlename = req.body.middlename;
    user.lastname = req.body.lastname;
    user.dateOfBirth = req.body.dateOfBirth;
    user.address = req.body.address;
    user.digitalAddress = req.body.digitalAddress;
    user.phone = req.body.phone;
    user.salary = req.body.salary;
    user.imageUri = req.body.imageUri;
    user.branch = branch;
    user.designation = designation;
  }

  await user.save();

  res.send(user);
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send("User not found.");

  res.send(user);
};

const login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email }).populate(
    "designation"
  );
  if (!user) return res.status(400).send("Invalid username or password.");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(404).send("Invalid username or password.");

  const token = user.generateAuthToken();
  res.send(token);
};

module.exports.createUser = createUser;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.login = login;
