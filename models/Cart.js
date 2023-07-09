const mongoose = require('mongoose');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        required: function () {
            return !this.customPrice
        }
    },
    customPrice: {
        type: Number,
        min: 0,
    }
});



const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        unique: true,
        required: true
    },
    items: [cartItemSchema]
});


const validateCartItem = (orderItem) => {
    const schema = Joi.object({
        productId: Joi.objectId().required(),
        quantity: Joi.number().min(0),
        customPrice: Joi.number().min(0)
    });


    return schema.validate(orderItem);
}


const Cart = mongoose.model("Cart", cartSchema);


module.exports.Cart = Cart;
module.exports.validateCartItem = validateCartItem;