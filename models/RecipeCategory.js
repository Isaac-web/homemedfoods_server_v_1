const mongoose = require("mongoose");
const Joi = require("joi");

const RecipeCategory = mongoose.model(
  "RecipeCategory",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      imageUri: {
        type: String,
        max: 2048,
      },
      desc: {
        type: String,
        max: 500,
      },
    },
    { timestamps: true }
  )
);

const validate = (recipeCategory) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    imageUri: Joi.string().min(0).max(2048),
    desc: Joi.string().min(0).max(500),
  });

  return schema.validate(recipeCategory);
};

module.exports.RecipeCategory = RecipeCategory;
module.exports.validate = validate;
