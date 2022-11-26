const express = require("express");
const controller = require("../controllers/orders");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId");
const orders = require("../controllers/orders");
const errorHandler = require("../middleware/routeErrorHandler");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", [customerAuth], errorHandler(controller.createOrder));
router.get("/", errorHandler(controller.getOrders));
router.get(
  "/customer",
  [customerAuth],
  errorHandler(controller.getCustomerOrders)
);
router.get(
  "/branch",
  auth("mananger"),
  errorHandler(controller.getBranchOrders)
);
router.patch(
  "/:id/status",
  [validateId],
  errorHandler(controller.updateOrderStatus)
);
router.get("/:id", [validateId], errorHandler(controller.getOrder)); //todo: add valiation
router.patch("/:id/dispatch", [validateId], errorHandler(controller.dispatchOrder));
router.patch("/:id/opened", [validateId], errorHandler(controller.updateOnOpen));
router.patch("/:id", [validateId], errorHandler(controller.updateOrder));
router.delete("/", errorHandler(orders)); //Todo: Only the admin should be able to delete the order

module.exports = router;
