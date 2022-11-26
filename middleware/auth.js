const config = require("config");
const { Designation } = require("../models/Designation");
const { Employee } = require("../models/Employee");
const jwt = require("jsonwebtoken");

module.exports = (privilege) => {
  if (!privilege) throw new Error("privilege cannot be null");

  return async (req, res, next) => {
    const privileges = config.get("auth.privileges");
    const privilegeValue = privileges[privilege];

    const token = req.headers["x-auth-token"];
    if (!token) return res.status(401).send("No token provided");

    try {
      const decode = jwt.verify(token, config.get("auth.privateKey"));

      const [employee, designation] = await Promise.all([
        Employee.findById(decode._id),
        Designation.findById(decode.designationId),
      ]);

      const designationValue = privileges[designation.value];
      if (designationValue < privilegeValue)
        return res.status(403).send("Access Denied.");

      req.employee = employee;
      next();
    } catch (err) {
      return res.status(400).send("Access Denied. Invalid credentials.");
    }
  };
};
