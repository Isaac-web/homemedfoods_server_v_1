const express = require("express");
const controller = require("../controllers/customerAddresses");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId.js");

const router = express.Router();

router.post("/", customerAuth, controller.addAddress);
router.get("/", customerAuth, controller.getCustomerAddresses);
router.patch("/:id", [customerAuth, validateId], controller.updateAddress);
router.delete(
  "/:id",
  [customerAuth, validateId],
  controller.deleteCustomerAddress
);

module.exports = router;
