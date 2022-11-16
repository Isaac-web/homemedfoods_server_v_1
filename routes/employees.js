const express = require("express");
const controller = require("../controllers/employees");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/new", controller.createEmployee);
router.get("/", controller.getEmployees);
router.get("/:id", [validateId], controller.getEmployee);
router.put("/:id", [validateId], controller.updateEmployee);
router.delete("/:id", [validateId], controller.deleteEmployee);

module.exports = router;
