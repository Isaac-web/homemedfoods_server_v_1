const express = require("express");
const errorHandler = require("../middleware/routeErrorHandler");

const controller = require("../controllers/customers");

const router = express.Router();

router.post("/register", errorHandler(controller.register));
router.post("/login", errorHandler(controller.login));

module.exports = router;
