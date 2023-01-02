const express = require("express");
const controller = require("../controllers/resports");

const router = express.Router();

router.get("/summary", controller.getSummery);

module.exports = router;
