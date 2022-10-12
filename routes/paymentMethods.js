const express = require("express");
const controller = require("../controllers/paymentMethods");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", controller.createPaymentMethod);
router.get("/", controller.getPaymentMethods);
router.patch("/:id", [validateId], controller.updatePaymentMethod);
router.delete("/:id", [validateId], controller.deletePaymentMethod);
module.exports = router;
