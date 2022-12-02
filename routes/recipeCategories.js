const express = require("express");
const errorHandler = require("../middleware/routeErrorHandler");
const recipeCategories = require("../controllers/recipeCategories");
const validateId = require("../middleware/validateId");
const auth = require("../middleware/auth");
validateId;

const router = express.Router();

router.post("/", auth("admin"), errorHandler(recipeCategories.createCategory));
router.get("/:id", errorHandler(recipeCategories.createCategory));
router.get("/", errorHandler(recipeCategories.getCategories));
router.put(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(recipeCategories.updateCategory)
);
router.delete(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(recipeCategories.deleteCategory)
);

module.exports = router;
