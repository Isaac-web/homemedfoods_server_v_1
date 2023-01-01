const express = require("express");
const controller = require("../controllers/otp");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();

router.post("/generate", errorHandler(controller.generateOTP));
router.post("/verify", errorHandler(controller.verifyOTP));

module.exports = router;
