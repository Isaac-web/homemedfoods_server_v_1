const express = require("express");
const auth = require("../middleware/auth");
const errorHandler = require("../middleware/routeErrorHandler");
const validateId = require("../middleware/validateId");
const recipes = require("../controllers/recipes");

const router = express.Router();

router.post("/", auth("admin"), errorHandler(recipes.createRecipe));
router.get("/:id", [validateId], errorHandler(recipes.getRecipe));
router.get("/", errorHandler(recipes.getRecipes));
router.put("/:id", [validateId, auth("admin")], errorHandler(recipes.updateRecipe));
router.delete(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(recipes.deleteRecipe)
);

module.exports = router;
