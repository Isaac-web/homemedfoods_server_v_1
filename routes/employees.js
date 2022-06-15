const express = require("express");
const controller = require("../controllers/employees");

const router = express.Router();

router.post("/", controller.createEmployee);
router.get("/", controller.getEmployees);
router.get("/:id", controller.getEmployee);
router.patch("/:id", controller.updateEmployee);
router.delete("/:id", controller.deleteEmployee);
router.post("/invite", controller.inviteEmpolyee);

module.exports = router;
