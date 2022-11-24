const express = require("express");
const controller = require("../controllers/orders");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();

router.post("/", [customerAuth], errorHandler(controller.createOrder));
router.get("/", controller.getOrders);
router.get("/:id", [validateId], errorHandler(controller.getOrder));//todo: add valiation
router.get("/customer", [customerAuth], errorHandler(controller.getCustomerOrders));
router.patch("/:id/status", [validateId], errorHandler(controller.updateOrderStatus));
router.patch("/:id", [validateId], errorHandler(controller.updateOrder));
router.delete("/", (req, res) => {}); //Todo: Only the admin should be able to delete the order

module.exports = router;
