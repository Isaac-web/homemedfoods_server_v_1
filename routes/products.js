const express = require("express");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");
const {
  createProduct,
  getProducts,
  updateProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/products");

const router = express.Router();

router.post("/", createProduct);
router.get("/", errorHandler(getProducts));
router.get("/:id", [validateId], getProduct);
router.patch("/:id", [validateId], updateProduct);
router.delete("/:id", [validateId], deleteProduct);
module.exports = router;