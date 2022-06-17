const express = require("express");
const controller = require("../controllers/invitations");

const router = express.Router();

router.post("/", controller.sendInvitation);
router.get("/", controller.getInvitations);
router.get("/", controller.getInvitation);
router.delete("/", controller.deleteInvitation);

module.exports = router;
