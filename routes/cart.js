const express = require("express");
const { addItem, getCart, removeItem, checkout } = require("../controllers/cart");
const customerCart = require("../middleware/customerCart");
const customerAuth = require("../middleware/customerAuth");

const router = express.Router();

router.post("/items", [customerAuth, customerCart], addItem);
router.get("/me", [customerAuth, customerCart], getCart);
router.delete("/items/:id", [customerAuth, customerCart], removeItem);
router.post("/checkout", [customerAuth, customerCart], checkout)


module.exports = router;