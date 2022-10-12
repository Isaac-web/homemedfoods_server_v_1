const controller = require("../controllers/cartItems");
const express = require("express");
const validateId = require("../middleware/validateId");
const customerAuth = require("../middleware/customerAuth");

const router = express.Router();

router.post("/", [customerAuth], controller.addItem);
router.get("/", [customerAuth], controller.getItems);
router.patch("/:id", [validateId, customerAuth], controller.updateItem);
router.delete("/:id", [validateId, customerAuth], controller.deleteItem);

module.exports = router;
