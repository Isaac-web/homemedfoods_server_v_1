const express = require("express");
const errorHandler = require("../middleware/routeErrorHandler");
const validateId = require("../middleware/validateId");
const recipes = require("../controllers/recipes");

const router = express.Router();

router.post("/", errorHandler(recipes.createRecipe));
router.get("/:id", [validateId], errorHandler(recipes.getRecipe));
router.get("/", errorHandler(recipes.getRecipes));
router.put("/:id", [validateId], errorHandler(recipes.updateRecipe));

module.exports = router;
