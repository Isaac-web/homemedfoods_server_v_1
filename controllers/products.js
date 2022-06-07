const _ = require("lodash");
const { Product, validate, validateOnUpdate } = require("../models/Product");
const { ProductCategory } = require("../models/ProductCategory");
const { Discount } = require("../models/Discount");
const validateObjectId = require("../utils/validateObjectId");
const { ProductInventory } = require("../models/ProductInventory");

const createProduct = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //create inventory
  let inventory = new ProductInventory({ quantity: req.body.quantity });

  //create product
  let product = new Product({
    name: req.body.name,
    desc: req.body.desc,
    category: req.body.categoryId,
    price: req.body.price,
    inventory: inventory._id,
    discount: req.body.discountId,
  });

  let category = ProductCategory.findById(req.body.categoryId);
  inventory = inventory.save();
  product = product.save();

  [inventory, product, category] = await Promise.all([
    inventory,
    product,
    category,
  ]);

  product.inventory = inventory;
  product.category = category;
  res.send(product);
};

const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category", "name desc")
    .populate("inventory")
    .populate("discount");

  res.send(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name desc")
    .populate("discount", "name discountPercent")
    .populate("inventory", "-createdAt");

  if (!product) return res.status(404).send("Product not found.");

  res.send(product);
};

const updateProduct = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findById(req.params.id)
    .populate("category", "name desc")
    .populate("discount", "name desc discountPercent")
    .populate("inventory");
  if (!product) return res.status(404).send("Product not found.");

  const { categoryId, discountId, quantity } = req.body;
  product.set(_.pick(req.body, ["name", "desc", "price"]));

  //category update
  if (categoryId) {
    if (!validateObjectId(categoryId))
      return res.status(400).send("Invalid Category Id.");

    const category = await ProductCategory.findById(categoryId);
    if (!category) return res.status(400).send("Category not found.");

    product.category = category;
  }

  //discount update
  if (discountId) {
    if (!validateObjectId(discountId))
      return res.status(400).send("Invalid discount Id.");

    const discount = await Discount.findById(discountId);
    if (!discount) return res.status(404).send("Discount not found.");

    product.discount = discount;
  }

  //update inventory
  if (quantity) {
    product.inventory = await ProductInventory.findByIdAndUpdate(
      product.inventory._id,
      {
        $set: { quantity },
      },
      { new: true }
    );
  }

  await product.save();
  res.send(product);
};

const deleteProduct = async (req, res) => {
  let product = await Product.findByIdAndRemove(req.params.id);
  await ProductInventory.findByIdAndRemove(product.inventory);

  if (!product) return res.status(404).send("Product not found.");

  res.send(product);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
