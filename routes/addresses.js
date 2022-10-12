const express = require("express");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addresses");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId");

const router = express.Router();
router.post("/", [customerAuth], createAddress);
router.get("/", [customerAuth], getAddresses);
router.patch("/:id", [validateId, customerAuth], updateAddress);
router.delete("/:id", [validateId, customerAuth], deleteAddress);

module.exports = router;