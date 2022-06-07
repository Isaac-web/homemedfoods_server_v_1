const express = require("express");
const discountController = require("../controllers/discounts");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", discountController.createDiscount);
router.get("/", discountController.getAllDiscounts);
router.get("/:id", [validateId], discountController.getDiscount);
router.patch("/:id", [validateId], discountController.updateDiscount);
router.delete("/:id", [validateId], discountController.deleteDiscount);

module.exports = router;
