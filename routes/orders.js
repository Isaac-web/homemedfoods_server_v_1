const express = require("express");
const controller = require("../controllers/orders");
const customerAuth = require("../middleware/customerAuth");
const validateId = require("../middleware/validateId");
const orders = require("../controllers/orders");
const errorHandler = require("../middleware/routeErrorHandler");
const auth = require("../middleware/auth");

const router = express.Router();

//Hello World
router.post("/", [customerAuth], errorHandler(controller.createOrder));
router.get("/", auth("admin"), errorHandler(controller.getOrders));
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

router.get(
  "/branch/pending",
  auth("mananger"),
  errorHandler(controller.getBranchPendingOrders)
);

router.patch(
  "/:id/shopper",
  [validateId, auth("mananger")],
  errorHandler(controller.updateOrderProcess)
);
router.get("/:id", [validateId], errorHandler(controller.getOrder)); //todo: add valiation
router.patch(
  "/:id/dispatch",
  [validateId, auth("mananger")],
  errorHandler(controller.dispatchOrder)
);
router.patch(
  "/:id/opened",
  [validateId, auth("mananger")],
  errorHandler(controller.updateOnOpen)
);
router.patch(
  "/:id/mark_as_delivered",
  [validateId, auth("mananger")],
  errorHandler(controller.markAsDelivered)
);
router.patch("/:id", [validateId, auth("mananger"),], errorHandler(controller.updateOrder));
router.delete("/:id", auth("mananger"), errorHandler(controller.deleteOrder)); //Todo: Only an admin should be able to delete the order

module.exports = router;
