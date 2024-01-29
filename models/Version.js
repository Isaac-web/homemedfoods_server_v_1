const mongoose = require('mongoose');
const Joi = require('joi');

const Version = mongoose.model(
  'Version',
  new mongoose.Schema({
    platform: {
      type: String,
      maxlength: 32,
      enum: ['ios', 'android'],
      required: true,
      unique: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    latestVersion: {
      value: {
        type: String,
        required: true,
        maxlength: 32,
      },
      releaseDate: {
        type: Date,
        default: function () {
          return Date.now();
        },
      },
      releaseNotes: {
        type: String,
        trim: true,
        default: '',
      },
    },
    minimumSupportedVersion: {
      value: {
        type: String,
        maxlength: 32,
        required: true,
      },
      releaseDte: {
        type: Date,
        default: function () {
          return Date.now();
        },
      },
      releaseNotes: {
        type: String,
        trim: true,
        default: '',
      },
    },
  })
);

const validateVersion = (version) => {
  const schema = Joi.object({
    platform: Joi.string().required(),
    downloadUrl: Joi.string().required(),
    latestVersion: Joi.object({
      value: Joi.string(),
      releaseDte: Joi.date().optional(),
      releaseNotes: Joi.string().optional(),
    }),
    minimumSupportedVersion: Joi.object({
      value: Joi.string(),
      releaseDte: Joi.date().optional(),
      releaseNotes: Joi.string().optional(),
    }),
  });

  return schema.validate(version);
};

module.exports.Version = Version;
module.exports.validateVersion = validateVersion;
