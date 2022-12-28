const { Recipe, validate } = require("../models/Recipe");
const { RecipeCategory } = require("../models/RecipeCategory");
const { Product } = require("../models/Product");
const uploader = require("../utils/uploader");

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
    return res
      .status(401)
      .send("There is already a recipe with the given name.");

  const recipe = await new Recipe({
    name: req.body.name,
    category: req.body.categoryId,
    description: req.body.description,
    ingredients: req.body.ingredients,
    "yield.value": req.body.yieldValue,
    "yield.label": req.body.yieldLabel,
    prepTime: req.body.prepTime,
    cookingTime: req.body.cookingTime,
    cookingMethod: req.body.cookingMethod,
    suitableFor: req.body.suitableFor,
    procedure: req.body.procedure,
    "video.url": req.body.videoUrl,
    "video.public_id": req.body.videoPublicId,
    "image.url": req.body.imageUrl,
    "image.public_id": req.body.imagePublicId,
  });

  await recipe.save();

  res.send(recipe);
};

const getRecipes = async (req, res) => {
  const pageSize = req.query.pageSize;
  const currentPage = req.query.currentPage;

  const [recipes, count] = await Promise.all([
    Recipe.find()
      .populate("category")
      .select("-procedure")
      .skip(currentPage * pageSize || 0)
      .limit(pageSize),
    ,
    Recipe.find().count(),
  ]);

  res.send({ recipes, count, currentPage, pageSize });
};

const getRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(404).send("Recipe not found.");

  const ingredients = recipe.ingredients.map((p) => p.product);
  let ingredientList = await Product.find({ _id: { $in: ingredients } });

  ingredientList = ingredientList.map((item) => {
    const result = recipe.ingredients.filter(
      (ri) => ri.product.toHexString() == item._id.toHexString()
    );

    if (result.length)
      item = Object.assign({}, item._doc, { quantity: result[0].quantity });

    return item;
  });

  res.send({ recipe, ingredientList });
};

const updateRecipe = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status("Looks like the recipe cannot be found.");

  recipe.name = req.body.name;
  recipe.category = req.body.categoryId;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.cookingTime = req.body.cookingTime;
  recipe.cookingMethod = req.body.cookingMethod;
  recipe.suitableFor = req.body.suitableFor;
  recipe.procedure = req.body.procedure;
  recipe.videoUrl = req.body.videoUrl;
  recipe.ratings = req.body.ratings;
  if (req.body.imageUrl) recipe.imgaeUrl = req.body.imageUrl;

  await recipe.save();

  res.send(recipe);
};

const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe.image.public_id) {
    try {
      await uploader.deleteFile(recipe.image.public_id)
    }
    catch(err){
      return res.status(500).send("Something went wrong while deleting the recipe.")
    }
  }

  recipe.remove();

  if (!recipe)
    return res.status(404).send("Lookes like the id recipe cannot be found.");

  res.send(recipe);
};

exports.createRecipe = createRecipe;
exports.getRecipes = getRecipes;
exports.getRecipe = getRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;
