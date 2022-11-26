const express = require("express");
const controller = require("../controllers/employees");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/new", auth("admin"), errorHandler(controller.createEmployee));
router.post("/login", errorHandler(controller.login));
router.get("/", errorHandler(controller.getEmployees));
router.get("/:id", [validateId], errorHandler(controller.getEmployee));
router.put(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(controller.updateEmployee)
);
router.delete(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(controller.deleteEmployee)
);

module.exports = router;
