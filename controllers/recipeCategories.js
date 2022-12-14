const { RecipeCategory, validate } = require("../models/RecipeCategory");
const { Recipe } = require("../models/Recipe");

const createCategory = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recipeCategory = new RecipeCategory({
    name: req.body.name,
    desc: req.body.desc,
    "image.url": req.body.imageUrl,
    "image.public_id": req.body.imagePublicId,
  });

  await recipeCategory.save();

  res.send(recipeCategory);
};

const getCategories = async (req, res) => {
  const pageSize = req.query.pageSize || null;
  const currentPage = req.query.currentPage || 0;

  const [categories, count] = await Promise.all([
    RecipeCategory.find()
      .skip(currentPage * pageSize)
      .limit(pageSize),
    RecipeCategory.find().count(),
  ]);

  res.send({ count, currentPage, pageSize, categories });
};

const getCategory = async (req, res) => {
  const category = await RecipeCategory.findById(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("Looks like this recipe category cannot be found.");

  res.send(categories);
};

const updateCategory = async (req, res) => {
  const category = await RecipeCategory.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        desc: req.body.desc,
        imageUri: req.body.imageUri,
      },
    },
    { new: true }
  );

  if (!category)
    return res
      .status(404)
      .send("Looks like the recipe category cannot be found.");

  res.send(category);
};

const deleteCategory = async (req, res) => {
  const recipe = await Recipe.findOne({ category: req.params.id });
  if (recipe)
    return res
      .status(401)
      .send("Could not delete. This category is linked to some recipes.");

  const category = await RecipeCategory.findByIdAndRemove(req.params.id);
  if (!category)
    return res
      .status(404)
      .send("Looks like the recipe category cannot be found.");

  res.send(category);
};

module.exports.createCategory = createCategory;
module.exports.getCategories = getCategories;
module.exports.getCategory = getCategory;
module.exports.updateCategory = updateCategory;
module.exports.deleteCategory = deleteCategory;
