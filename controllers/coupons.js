const { Coupon, validate } = require("../models/Coupon");
const generateCoupon = require("../utils/generateCoupon");

const createCoupon = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingCoupon = await Coupon.findOne({
    name: req.body.name,
  });

  if (existingCoupon)
    return res.status(400).send("A coupon the the given name already exist.");

  const voucher = await generateCoupon();

  const coupon = new Coupon({
    name: req.body.name,
    description: req.body.description,
    amount: req.body.amount,
    limit: req.body.limit,
    active: req.body.active,
    expiresAt: req.body.expiresAt,
    code: voucher,
  });

  await coupon.save();

  return res.send(coupon);
};

const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();

  res.send({ coupons });
};

const getCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon)
    return res.status(404).send("Looks like the coupon cannot be found.");

  res.send(coupon);
};

const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        amount: req.body.amount,
        limit: req.body.limit,
        active: req.body.active,
        expiresAt: req.body.expiresAt,
      },
    },
    { new: true }
  );

  if (!coupon)
    return res.status(404).send("Looks like the coupon cannot be found.");

  return res.send(coupon);
};

const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndRemove(req.params.id);

  if (!coupon)
    return res.status(404).send("Looks like the coupon cannot be found.");

  res.send(coupon);
};

exports.createCoupon = createCoupon;
exports.getCoupons = getCoupons;
exports.getCoupon = getCoupon;
exports.deleteCoupon = deleteCoupon;
exports.updateCoupon = updateCoupon;
