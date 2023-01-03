const express = require("express");
const errorHandler = require("../middleware/routeErrorHandler");

const controller = require("../controllers/customers");
const auth = require("../middleware/auth");
const customerAuth = require("../middleware/customerAuth");

const router = express.Router();

router.post("/register", errorHandler(controller.register));
router.post("/login", errorHandler(controller.login));
router.get("/", auth("manager"), errorHandler(controller.getCustomers));
router.get("/me", customerAuth, errorHandler(controller.getCustomer));
router.get("/:id", auth("manager"), errorHandler(controller.getCustomer));
router.put(
  "/me/reset-password",
  customerAuth,
  errorHandler(controller.resetPassword)
);
router.put("/me", customerAuth, errorHandler(controller.updateCustomer));
router.delete("/me", customerAuth, errorHandler(controller.deleteCustomer));

module.exports = router;
