const express = require("express");
const controller = require("../controllers/branches");
const validateId = require("../middleware/validateId");
const errorHander = require("../middleware/routeErrorHandler");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth("admin"), errorHander(controller.createBranch));
router.get("/", errorHander(controller.getBranches));
router.get("/:id", [validateId], errorHander(controller.getBranch));
router.patch(
  "/:id",
  [validateId, auth("admin")],
  errorHander(controller.updateBranch)
);
router.delete(
  "/:id",
  [validateId, auth("admin")],
  errorHander(controller.deleteBranch)
);

module.exports = router;
