const express = require("express");
const validateId = require("../middleware/validateId");
const {
  createProductCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/productCategory");

const router = express.Router();
router.post("/", createProductCategory);
router.get("/", getAllCategories);
router.get("/:id", [validateId], getCategory);
router.patch("/:id", [validateId], updateCategory);
router.delete("/:id", [validateId], deleteCategory);

module.exports = router;
