const express = require("express");
const notification = require("../controllers/customerNotifications");
const customerAuth = require("../middleware/customerAuth");
const router = express.Router();

router.get("/me", [customerAuth], notification.getCustomerNotifications);
router.get("/:id", [customerAuth], notification.getNotification);
router.delete("/:id", [customerAuth], notification.deleteNoticiation);

module.exports = router;
