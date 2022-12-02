const config = require("config");
const { Designation } = require("../models/Designation");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = (privilege) => {
  if (!privilege) throw new Error("privilege cannot be null");

  return async (req, res, next) => {
    if (req.originalUrl.includes("/api/users")) {
      const user = await User.findOne();
      if (!user) return next();
    }

    const privileges = config.get("auth.privileges");
    const privilegeValue = privileges[privilege];
    const token = req.headers["x-auth-token"];
    if (!token) return res.status(401).send("No token provided.");

    try {
      const decode = jwt.verify(token, config.get("auth.privateKey"));

      const user = await User.findById(decode._id);
      if (user.userType == "system") return next();

      if (privilege === "system" && user.userType !== "system")
        return res.status(403).send("Access denied.");

      const designation = Designation.findById(user.designation);
      const designationValue = privileges[designation.value];
      if (designationValue < privilegeValue)
        return res.status(403).send("Access Denied.");

      req.employee = user;
      next();
    } catch (err) {
      return res.status(400).send("Access Denied.");
    }
  };
};
