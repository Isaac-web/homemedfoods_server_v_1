const voucher_code = require("voucher-code-generator");
const { Coupon } = require("../models/Coupon");

const generateCoupon = async () => {
  const [voucher] = voucher_code.generate({
    length: 7,
    prefix: "D",
    pattern: "-#######",
  });

  const coupon = await Coupon.findOne({ code: voucher });

  if (!coupon) return voucher;

  generateCoupon();
};

module.exports = generateCoupon;
