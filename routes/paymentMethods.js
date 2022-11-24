const express = require("express");
const controller = require("../controllers/paymentMethods");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();

router.post("/", errorHandler(controller.createPaymentMethod));
router.get("/", errorHandler(controller.getPaymentMethods));
router.patch("/:id", [validateId], errorHandler(controller.updatePaymentMethod));
router.delete("/:id", [validateId], errorHandler(controller.deletePaymentMethod));
module.exports = router;
