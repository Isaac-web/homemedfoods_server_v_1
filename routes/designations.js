const controller = require("../controllers/designations");
const express = require("express");
const validateId = require("../middleware/validateId");

const router = express.Router();

//TODO: IMPLEMENT AUTHENTICATION ON THE ENDPOINTS
router.get("/", controller.getDesignations);
router.post("/", controller.createDesignation);
router.patch("/:id", [validateId], controller.updateDesignation);
router.delete("/:id", [validateId], controller.deleteDesignation);

module.exports = router;
