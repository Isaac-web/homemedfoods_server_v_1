const mongoose = require("mongoose");

const OrderPayamentInfo = mongoose.model("OrderPaymentInfo", new mongoose.Schema({
    reference: {
        type: String,
        unique: true
    },
    customer: mongoose.Types.ObjectId,
    branchId: mongoose.Types.ObjectId,
    comment: String,
    items: [],
    subtotal: Number,
    delivery: Number,
    total: Number,
    paymentMethod: mongoose.Types.ObjectId,
    deliveryAddress: {},
}));


module.exports.OrderPayamentInfo = OrderPayamentInfo;