const { Customer } = require("../models/Customer");
const { Recipe } = require("../models/Recipe");
const { Product } = require("../models/Product");

const getSummery = async (req, res) => {
  const [productsCount, recipeCount, customerCount] = await Promise.all([
    Product.find().count(),
    Recipe.find().count(),
    Customer.find().count(),
  ]);

  res.send({ productsCount, recipeCount, customerCount });
};

exports.getSummery = getSummery;
