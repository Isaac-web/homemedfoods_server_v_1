const express = require("express");
const controller = require("../controllers/addresses");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/:userType/:id", [validateId], controller.createAddress);
router.get("/:userId", controller.getAddresses);
router.patch("/:id", [validateId], controller.updateAddress);
router.delete("/:id", [validateId], controller.deleteAddress);

module.exports = router;
