const mongoose = require("mongoose");
const generateUniqueId = require("generate-unique-id");

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  pin: {
    type: String,
    length: 6,
    default: function () {
      return generateUniqueId({ length: 6, useLetters: false });
    },
  },
  expiresAt: {
    type: Date,
    default: function () {
      return Date.now() + 1000 * 60 * 7;
    },
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports.OTP = OTP;
