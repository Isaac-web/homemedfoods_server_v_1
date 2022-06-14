const express = require("express");
const cityController = require("../controllers/cities");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", cityController.createCity);
router.get("/", cityController.getCities);
router.patch("/:id", [validateId], cityController.updateCity);
router.delete("/:id", [validateId], cityController.deleteCity);

module.exports = router;
