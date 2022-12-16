const _ = require("lodash");
const { Product, validate, validateOnUpdate } = require("../models/Product");
const { ProductCategory } = require("../models/ProductCategory");
const { Recipe } = require("../models/Recipe");
const uploader = require("../utils/uploader");
const validateObjectId = require("../utils/validateObjectId");

const createProduct = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product({
    name: req.body.name,
    desc: req.body.desc,
    category: req.body.categoryId,
    price: req.body.price,
    unit: req.body.unit,
    priceFixed: req.body.priceFixed,
    "image.url": req.body?.imageUri,
    "image.public_id": req.body?.imagePublicId,
    status: req.body.status,
    discount: req.body.discountId,
  });

  let category = ProductCategory.findById(req.body.categoryId);
  product = product.save();

  [product, category] = await Promise.all([product, category]);

  product.category = category;
  res.send(product);
};

const getProducts = async (req, res) => {
  const { categoryId, currentPage, pageSize } = req.query;

  const filter = {}; //query object
  if (categoryId && validateObjectId(categoryId)) filter.category = categoryId;

  const [products, count] = await Promise.all([
    Product.find(filter)
      .populate("category", "name desc")
      .populate("discount")
      .skip(currentPage * pageSize || 0)
      .limit(pageSize),
    Product.find(filter).count(),
  ]);

  res.send({ count, currentPage, products, pageSize });
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name desc")
    .populate("discount", "name discountPercent");

  if (!product) return res.status(404).send("Product not found.");

  res.send(product);
};

const searchProduct = async (req, res) => {
  const searchString = new RegExp(req.query.q, "i");

  const searchResult = await Product.find({ name: searchString })
    .populate("category", "name desc")
    .populate("discount", "name discountPercent");

  res.send(searchResult);
};

const updateProduct = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");

  if (product?.image?.url && req.body.imageUri) {
    if (product.image.url != req.body.imageUri) {
      const rawPublicId = product.image.url.split("/").slice(-2).join("/");
      const _publicId = rawPublicId.split(".")[0];

      try {
        await uploader.deleteFile(product.image?.public_id || _publicId);
      } catch (err) {
        return res.status(400).send("Oops... could not update product.");
      }
    }
  }

  product.name = req.body.name;
  product.desc = req.body.desc;
  product.category = req.body.categoryId;
  product.price = req.body.price;
  product.unit = req.body.unit;
  product.priceFixed = req.body.priceFixed;
  product.status = req.body.status;
  product.discount = req.body?.discountId;

  if (req.body.imageUri) {
    product.image.url = req.body.imageUri;
    product.image.public_id = req.body?.imagePublicId;
  }

  await product.save();
  return res.send(product);
};

const deleteProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");

  if (product?.image?.url) {
    const rawPublicId = product.image.url.split("/").slice(-2).join("/");
    const _publicId = rawPublicId.split(".")[0];
    try {
      await uploader.deleteFile(product.image?.public_id || _publicId);
    } catch (err) {
      return res.status(400).send("Oops... could not update product.");
    }
  }

  //checkif any recipe is linked to this product

  product.remove();

  res.send(product);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.searchProduct = searchProduct;
