const mongoose = require("mongoose");

const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    line_1: {
      type: String,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    line_2: {
      type: String,
      maxlength: 1024,
      trim: true,
      required: true,
    },
    line_3: {
      type: String,
      maxlength: 1024,
      trim: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    coordinates: {
      long: Number,
      lat: Number,
    },
  })
);

exports.Address = Address;
