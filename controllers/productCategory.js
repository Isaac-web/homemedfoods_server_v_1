const _ = require("lodash");
const {
  ProductCategory,
  validate,
  validateOnUpdate,
} = require("../models/ProductCategory");
const { Product } = require("../models/Product");

const createProductCategory = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new ProductCategory(_.pick(req.body, ["name", "desc"]));
  await category.save();
  res.send(category);
};

const getAllCategories = async (req, res) => {
  const categories = await ProductCategory.find();

  res.send(categories);
};

const getCategory = async (req, res) => {
  const category = await ProductCategory.findById(req.params.id);
  if (!category) return res.status(404).send("Category not found.");

  res.send(category);
};

const updateCategory = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await ProductCategory.findByIdAndUpdate(
    req.params.id,
    {
      $set: _(req.body, ["name", "desc"]),
    },
    { new: true }
  );

  if (!category) return res.status(404).send("Category not found.");

  res.send(category);
};

const deleteCategory = async (req, res) => {
  const product = await Product.findOne({ category: req.params.id });
  if (product)
    return res
      .status(400)
      .send("Category has some products. Cannot be deleted.");

  const category = await ProductCategory.findByIdAndRemove(req.params.id);
  if (!category) return res.status(404).send("Category not found.");

  res.send(category);
};

const searchCategory = async (req, res) => {
  const searchString = new RegExp(req.query.q, "i");

  const searchResults = await ProductCategory.find({ name: searchString });
  return res.send(searchResults);
};

exports.createProductCategory = createProductCategory;
exports.getAllCategories = getAllCategories;
exports.getCategory = getCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.searchCategory = searchCategory;
