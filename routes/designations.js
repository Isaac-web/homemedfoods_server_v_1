const auth = require("../middleware/auth");
const controller = require("../controllers/designations");
const express = require("express");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();

//TODO: IMPLEMENT AUTHENTICATION ON THE ENDPOINTS
router.get("/", errorHandler(controller.getDesignations));
router.post("/", auth("system"), errorHandler(controller.createDesignation));
router.patch(
  "/:id",
  [validateId, auth("system")],
  errorHandler(controller.updateDesignation)
);
router.delete(
  "/:id",
  [validateId, auth("system")],
  errorHandler(controller.deleteDesignation)
);

module.exports = router;
