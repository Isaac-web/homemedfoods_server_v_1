const express = require("express");

const validateId = require("../middleware/validateId");
const controller = require("../controllers/customers");

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/", (req, res) => {});
router.get("/:id", [validateId], (req, res) => {});
router.patch("/:id", [validateId], (req, res) => {});
router.delete("/:id", [validateId], (req, res) => {});

module.exports = router;
