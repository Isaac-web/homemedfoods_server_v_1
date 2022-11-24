const controller = require("../controllers/designations");
const express = require("express");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();

//TODO: IMPLEMENT AUTHENTICATION ON THE ENDPOINTS
router.get("/", errorHandler(controller.getDesignations));
router.post("/", errorHandler(controller.createDesignation));
router.patch("/:id", [validateId], errorHandler(controller.updateDesignation));
router.delete("/:id", [validateId], errorHandler(controller.deleteDesignation));

module.exports = router;
