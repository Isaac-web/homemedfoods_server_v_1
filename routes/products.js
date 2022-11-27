const express = require("express");
const validateId = require("../middleware/validateId");
const errorHandler = require("../middleware/routeErrorHandler");
const {
  createProduct,
  getProducts,
  updateProduct,
  getProduct,
  deleteProduct,
  searchProduct,
} = require("../controllers/products");

const router = express.Router();

router.post("/", createProduct);
router.get("/search",  errorHandler(searchProduct));
router.get("/:id", [validateId], errorHandler(getProduct));
router.get("/", errorHandler(getProducts));
router.patch("/:id", [validateId], errorHandler(updateProduct));
router.delete("/:id", [validateId], errorHandler(deleteProduct));
module.exports = router;