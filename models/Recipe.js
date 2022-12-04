const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    reuqired: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecipeCategory",
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  ingredients: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    validate: {
      validator: function (list) {
        return Boolean(list?.length);
      },
      message: "There should be at least one ingredient for the recipe.",
    },
  },
  cookingTime: {
    type: Number,
    min: 0,
  },
  cookingMethod: {
    type: String,
    maxlength: 100,
    required: true,
    trim: true,
  },
  suitableFor: {
    type: String,
  },
  procedure: {
    type: [{ text: { type: String } }],
  },
  videoUrl: {
    type: String,
    max: 1024,
  },
  imageUrl: {
    type: String,
    max: 1024,
  },
  ratings: [
    {
      userId: mongoose.Types.ObjectId,
      rate: Number,
    },
  ],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

const validate = (recipe) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    categoryId: Joi.objectId().required(),
    description: Joi.string().min(0).max(500),
    ingredients: Joi.array()
      .items(
        Joi.object({
          product: Joi.objectId().required(),
        })
      )
      .min(1)
      .required(),
    cookingTime: Joi.number().min(0),
    cookingMethod: Joi.string().min(0).max(100).required(),
    suitableFor: Joi.string().min(0),
    procedure: Joi.array()
      .min(1)
      .items(
        Joi.object({
          text: Joi.string(),
        })
      ),
    videoUrl: Joi.string().max(1024),
    imageUrl: Joi.string().max(1024),
  });

  return schema.validate(recipe);
};

module.exports.Recipe = Recipe;
module.exports.validate = validate;
