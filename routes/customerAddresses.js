const express = require("express");
const controller = require("../controllers/customerAddresses");
const customerAddresses = require("../middleware/customerAuth");

const router = express.Router();

router.post("/", customerAddresses, controller.addAddress);
router.get("/", controller.getCustomerAddresses);
router.patch("/:id", controller.updateAddress);
router.delete("/:id", controller.deleteCustomerAddress);

module.exports = router;
