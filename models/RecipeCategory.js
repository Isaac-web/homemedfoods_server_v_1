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
      image: {
        url: String,
        public_id: String,
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
    imageUrl: Joi.string().min(0).max(2048),
    imagePublicId: Joi.string().min(0).max(128),
    desc: Joi.string().min(0).max(500),
  });

  return schema.validate(recipeCategory);
};

module.exports.RecipeCategory = RecipeCategory;
module.exports.validate = validate;
