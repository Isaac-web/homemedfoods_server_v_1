const express = require("express");
const controller = require("../controllers/invitations");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", controller.sendInvitation);
router.get("/", controller.getInvitations);
router.get("/:id", [validateId], controller.getInvitation);
router.delete("/:id", [validateId], controller.deleteInvitation);

module.exports = router;
