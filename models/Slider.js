const mongoose = require("mongoose");
const Joi = require("joi");

const Slider = mongoose.model(
  "Slider",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      createIndex: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    image: {
      url: { type: String, maxlength: 1024 },
      public_id: { type: String, maxlength: 1024 },
    },
  })
);

const validate = (slider) => {
  const schema = Joi.object({
    title: Joi.string().max(200).required(),
    subtitle: Joi.string().min(0).max(500).optional(),
    description: Joi.string().min(0).max(500).optional(),
    imageUrl: Joi.string().min(0).max(1024).optional(),
    imagePublicId: Joi.string().min(0).max(1024).optional(),
  });

  return schema.validate(slider);
};

exports.validate = validate;
exports.Slider = Slider;
