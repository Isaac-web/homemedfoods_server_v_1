const express = require("express");
const controller = require("../controllers/branches");
const validateId = require("../middleware/validateId");
const errorHander = require("../middleware/routeErrorHandler");

const router = express.Router();

router.post("/", errorHander(controller.createBranch));
router.get("/", errorHander(controller.getBranches));
router.get("/:id", [validateId], errorHander(controller.getBranch));
router.patch("/:id", [validateId], errorHander(controller.updateBranch));
router.delete("/:id", [validateId], errorHander(controller.deleteBranch));

module.exports = router;
