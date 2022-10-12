const express = require("express");
const controller = require("../controllers/orders");
const customerAuth = require("../middleware/customerAuth");
// const validateId = require("../middleware/validateId");

const router = express.Router();

router.post("/", [customerAuth], controller.createOrder);
router.get("/", (req, res) => {});
router.patch("/", (req, res) => {});
router.delete("/", (req, res) => {});

module.exports = router;
