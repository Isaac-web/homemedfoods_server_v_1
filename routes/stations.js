const express = require("express");
const validateId = require("../middleware/validateId");
const stationsController = require("../controllers/stations");

const router = express.Router();

router.post("/", stationsController.createStation);
router.get("/", stationsController.getStations);
router.get("/:id", [validateId], stationsController.getStation);
router.patch("/:id", [validateId], stationsController.updateStation);
router.delete("/:id", [validateId], stationsController.deleteStation);

module.exports = router;
