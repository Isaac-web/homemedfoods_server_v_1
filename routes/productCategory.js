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
router.post("/categories", createProductCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", [validateId], getCategory);
router.patch("/categories/:id", [validateId], updateCategory);
router.delete("/categories/:id", [validateId], deleteCategory);

module.exports = router;
