const axios = require("axios");
const { validateCartItem, Cart } = require("../models/Cart");
const { Product } = require("../models/Product");
const { OrderPayamentInfo } = require("../models/OrderPaymentInfo");
const { Branch } = require("../models/Branch");

const addItem = async (req, res) => {
    const { productId, quantity, customPrice } = req.body
    const { error } = validateCartItem(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message })


    const product = await Product.findById(productId);
    if (!product) return res.status(404).send({ message: "Looks like the product cannot be found." })

    const cart = req.cart;
    const cartItem = {
        product,
        quantity,
        customPrice
    }
    cart.items.push(cartItem)

    await cart.save();

    res.send({ message: "Added to cart.", cart, cartItem });
};


const getCart = async (req, res) => {
    let cart = await Cart.findOne({ userId: req.customer._id });

    const products = await Promise.all(cart.items.map(async item => {
        let product = await Product.findById(item.product);
        product = Object.assign({}, product._doc, {
            _id: item._id,
            productId: product._id,
            quantity: item.quantity,
            customPrice: item.customPrice
        });
        return product;
    }));

    let total = 0;
    products.forEach(item => {
        if (item.customPrice) total += item.customPrice;
        else total += item.price * item.quantity
    })

    cart = Object.assign({}, cart._doc, { items: products, subTotal: total });

    res.send(cart);
}



const removeItem = async (req, res) => {
    let cart = req.cart;
    const index = cart.items.findIndex(item => item._id == req.params.id)

    if (index >= 0) cart.items.splice(index, 1);
    else {
        return res.status(404).send({ message: "Looks like the given item cannot be found." })
    }

    await cart.save();

    const item = { _id: req.params.id }
    res.send({ message: "Item removed from cart.", item, cart });
};


const checkout = async (req, res) => {
    const branch = await Branch.findById(req.body.branchId);
    if (!branch.isOpen) return res.status(400).send({ message: "Looks like store is close for the day." })


    let cart = await Cart.findOne({ userId: req.customer._id });


    const products = await Promise.all(cart.items.map(async item => {
        let product = await Product.findById(item.product);
        product = Object.assign({}, product._doc, {
            _id: item._id,
            productId: product._id,
            quantity: item.quantity,
            customPrice: item.customPrice
        });
        return product;
    }));


    let subtotal = 0;
    products.forEach(item => {
        if (item.customPrice) subtotal += item.customPrice * item.quantity;
        else subtotal += item.price * item.quantity
    });



    if (!branch.isOpen)
        return res
            .status(400)
            .send("Looks like the given store is currently closed.");


    const orderItems = products.map(p => {
        const item = {
            productId: p.productId,
            productName: p.name,
            imageUri: p.image.url,
            quantity: p.quantity
        }

        if (!p.customPrice) item.unitPrice = p.price;
        else item.optionalPrice = p.customPrice

        return item;
    });




    const delivery = 8
    const bill = {
        subtotal,
        delivery,
        total: subtotal + delivery
    }
    const { data: paystackPayload } = await axios.request({
        url: "https://api.paystack.co/transaction/initialize",
        method: "POST",
        data: { email: "kanytakiy@gmail.com", amount: bill.total * 100 },
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET}`
        }
    });

    bill.authorizationURL = paystackPayload.data.authorization_url;
    bill.accessCode = paystackPayload.data.access_code;
    bill.reference = paystackPayload.data.reference;

    const orderPaymentInfo = new OrderPayamentInfo({
        reference: paystackPayload.data.reference,
        customer: req.customer._id,
        branchId: req.body.branchId,
        comment: req.body.comment,
        items: orderItems,
        subtotal: bill.subtotal.toFixed(2),
        delivery: bill.delivery.toFixed(2),
        total: bill.total.toFixed(2),
        paymentMethod: req.body.payment_method_id,
        deliveryAddress: req.body.delivery_address
    });

    await orderPaymentInfo.save();

    res.send({ message: "Please make your payment to proceed.", bill });
}






module.exports.addItem = addItem;
module.exports.getCart = getCart;
module.exports.removeItem = removeItem;
module.exports.checkout = checkout
