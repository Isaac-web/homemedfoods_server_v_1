const express = require("express");
const controller = require("../controllers/customerAddresses");
const customerAuth = require("../middleware/customerAuth");

const router = express.Router();

router.post("/", customerAuth, controller.addAddress);
router.get("/", customerAuth, controller.getCustomerAddresses);
router.patch("/:id", controller.updateAddress);
router.delete("/:id", controller.deleteCustomerAddress);

module.exports = router;
