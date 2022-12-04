const express = require("express");
const errorHandler = require("../middleware/routeErrorHandler");
const recipes = require("../controllers/recipes");

const router = express.Router();

router.post("/", errorHandler(recipes.createRecipe));
router.get("/:id", errorHandler(recipes.getRecipe));
router.get("/", errorHandler(recipes.getRecipes));

module.exports = router;
