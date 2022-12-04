const { Recipe, validate } = require("../models/Recipe");
const { RecipeCategory } = require("../models/RecipeCategory");
const { Product } = require("../models/Product");

const createRecipe = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //todo: look up category
  const [recipeCategory, existingRecipe] = await Promise.all([
    RecipeCategory.findById(req.body.categoryId),
    Recipe.findOne({ name: req.body.name }),
  ]);
  if (!recipeCategory)
    return res
      .status(404)
      .send("Looks like the chosen category cannot be found.");

  if (existingRecipe)
    return res.send(401).send("There is already a recipe with the given name.");

  const recipe = await new Recipe({
    name: req.body.name,
    category: req.body.categoryId,
    description: req.body.description,
    ingredients: req.body.ingredients,
    cookingTime: req.body.cookingTime,
    cookingMethod: req.body.cookingMethod,
    suitableFor: req.body.suitableFor,
    procedure: req.body.procedure,
    videoUrl: req.body.videoUrl,
    imageUrl: req.body.imageUrl,
  });

  await recipe.save();

  res.send(recipe);
};

const getRecipes = async (req, res) => {
  const recipes = await Recipe.find();

  res.send(recipes);
};

const getRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(404).send("Recipe not found.");

  const ingredients = recipe.ingredients.map((p) => p.product);
  const ingredientList = await Product.find({ _id: { $in: ingredients } });
  console.log(ingredientList);

  res.send({ recipe, ingredientList });
};

const updateRecipe = async (req, res) => {};

const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findByIdAndRemove(req.params.id);

  if (!recipe)
    return res.status(404).send("Lookes like the id recipe cannot be found.");

  res.send(recipe);
};

exports.createRecipe = createRecipe;
exports.getRecipes = getRecipes;
exports.getRecipe = getRecipe;
exports.deleteRecipe = deleteRecipe;
