const express = require("express");
const controller = require("../controllers/branches");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", controller.createBranch);
router.get("/", controller.getBranches);
router.get("/:id", [validateId], controller.getBranch);
router.patch("/:id", [validateId], controller.updateBranch);
router.delete("/:id", [validateId], controller.deleteBranch);

module.exports = router;
