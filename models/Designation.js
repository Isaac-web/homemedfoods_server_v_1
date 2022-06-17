const mongoose = require("mongoose");
const Joi = require("joi");

const Designation = mongoose.model(
  "Designation",
  new mongoose.Schema({ value: { type: String, minlength: 2, maxlength: 50 } })
);

const validate = (designation) => {
  const schema = Joi.object({
    value: Joi.string().min(2).max(50).required(),
  });

  return schema.validate(designation);
};

exports.validate = validate;
exports.Designation = Designation;
