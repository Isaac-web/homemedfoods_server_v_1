const express = require("express");
const controller = require("../controllers/sliders");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", [auth("admin")], controller.createSlider);
router.get("/", controller.getSliders);
router.get("/:id", [validateId], controller.getSlider);
router.put("/:id", [validateId, auth("admin")], controller.updateSlider);
router.delete("/:id", [validateId, auth("admin")], controller.deleteSlider);

module.exports = router;
