const express = require("express");
const { getMobileAppInfo } = require("../controllers/system");


const router = express.Router();

router.get("/mobile", getMobileAppInfo);


module.exports = router;