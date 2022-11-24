const express = require("express");
const controller = require("../controllers/orders");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", [customerAuth], controller.createOrder);
router.get("/", controller.getOrders);
router.get("/:id", [validateId], controller.getOrder); //todo: add valiation
router.get("/customer", [customerAuth], controller.getCustomerOrders)
router.patch("/:id/status", [validateId], controller.updateOrderStatus);
router.patch("/:id", [validateId], controller.updateOrder);
router.delete("/", (req, res) => {}); //Todo: Only the admin should be able to delete the order

module.exports = router;
