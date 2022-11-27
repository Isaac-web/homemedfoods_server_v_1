const express = require("express");
const validateId = require("../middleware/validateId");
const {
  createProductCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
} = require("../controllers/productCategory");
const errorHandler = require("../middleware/routeErrorHandler");

const router = express.Router();
router.post("/", errorHandler(createProductCategory));
router.get("/", errorHandler(getAllCategories));
router.get("/search", errorHandler(searchCategory));
router.get("/:id", [validateId], errorHandler(getCategory));
router.patch("/:id", [validateId], errorHandler(updateCategory));
router.delete("/:id", [validateId], errorHandler(deleteCategory));

module.exports = router;
