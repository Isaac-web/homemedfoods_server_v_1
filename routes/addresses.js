const express = require("express");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addresses");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();
router.post("/", [customerAuth], errorHandler(createAddress));
router.get("/", [customerAuth], errorHandler(getAddresses));
router.patch("/:id", [validateId, customerAuth], errorHandler(updateAddress));
router.delete("/:id", [validateId, customerAuth], errorHandler(deleteAddress));

module.exports = router;