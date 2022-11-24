const express = require("express");
const controller = require("../controllers/employees");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();

router.post("/new", errorHandler(controller.createEmployee));
router.get("/", errorHandler(controller.getEmployees));
router.get("/:id", [validateId], errorHandler(controller.getEmployee));
router.put("/:id", [validateId], errorHandler(controller.updateEmployee));
router.delete("/:id", [validateId], errorHandler(controller.deleteEmployee));

module.exports = router;
