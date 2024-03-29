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
        measure: {
          type: String, 
        },
        quantity: {
          type: Number, 
          min: 0, 
          default: 1
        }
        
      },
    ],
    validate: {
      validator: function (list) {
        return Boolean(list?.length);
      },
      message: "There should be at least one ingredient for the recipe.",
    },
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  yield: {
    value: {
      type: Number,
      min: 0,
      required: true,
    }, 
    label: {
      type: String, 
      maxlength: 100,
      required: true
    }
    
  },
  prepTime: {
    type: Number,
    min: 0,
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
  video: {
    url: String,
    public_id: String,
  },
  image: {
    url: String,
    public_id: String,
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
          _id: Joi.objectId().optional(),
          product: Joi.objectId().required(),
          quantity: Joi.number().min(0).optional(),
        })
      )
      .min(1)
      .required(),
    yieldValue: Joi.number().min(0).required(),
    yieldLabel: Joi.string().max(100).required(),
    prepTime: Joi.number().min(0).required(),
    cookingTime: Joi.number().min(0).required(),
    cookingMethod: Joi.string().min(0).max(100).required(),
    suitableFor: Joi.string().min(0),
    procedure: Joi.array()
      .items(
        Joi.object({
          _id: Joi.objectId().optional(),
          text: Joi.string(),
        })
      )
      .min(1),
    videoUrl: Joi.string().min(0).max(1024),
    videoPublicId: Joi.string().max(1024),
    imageUrl: Joi.string().max(1024),
    imagePublicId: Joi.string().max(1024),
  });

  return schema.validate(recipe);
};

module.exports.Recipe = Recipe;
module.exports.validate = validate;
