const express = require("express");
const controller = require("../controllers/coupons.js");
const errorHandler = require("../middleware/routeErrorHandler");
const validateId = require("../middleware/validateId");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", [auth("admin")], errorHandler(controller.createCoupon));
router.get("/customer", errorHandler(controller.getCustomerCuopon));
router.get(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(controller.getCoupon)
);
router.get("/", [auth("admin")], errorHandler(controller.getCoupons));
router.put(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(controller.updateCoupon)
);
router.delete(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(controller.deleteCoupon)
);

module.exports = router;
