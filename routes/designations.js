const express = require("express");
const controller = require("../controllers/desinations");
const validateId = require("../middleware/validateId");
const router = express.Router();

router.post("/", controller.createDesignation);
router.get("/", controller.getDesignations);
router.patch("/:id", [validateId], controller.updateDesignation);
router.delete("/:id", [validateId], controller.deleteDesignation);

module.exports = router;
