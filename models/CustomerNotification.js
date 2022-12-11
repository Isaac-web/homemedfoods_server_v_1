const mongoose = require("mongoose");

const CustomerNotification = mongoose.model(
  "CustomerNotification",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      title: {
        type: String,
        maxlength: 256,
        required: true,
      },
      text: {
        type: String,
        maxlength: 1024,
        required: true,
      },
      viewed: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

exports.CustomerNotification = CustomerNotification;
