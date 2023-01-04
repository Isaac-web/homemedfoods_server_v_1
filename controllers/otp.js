const { sendSms } = require("../utils/sms");
const { Customer } = require("../models/Customer");

const { OTP } = require("../models/OTP");

const generateOTP = async (req, res) => {
  const phone = req.body.phone;
  if (!phone) return res.status(400).send("Phone number is required.");

  const otp = new OTP({ phone });

  const [status] = await Promise.all([
    sendSms(otp.phone, `${otp.pin} is your Digimart verification code.`),
    otp.save(),
  ]);

  if (status != 200)
    return res.status(500).send("An error occured while sending an SMS.");

  res.send({ message: "OTP has been sent successfully." });
};

const verifyOTP = async (req, res) => {
  const phone = req.body.phone;
  const pin = req.body.pin;
  if (!phone) return res.status(400).send("Phone number is required.");

  const otp = await OTP.findOne({ phone, pin });
  if (!otp) return res.status(400).send("Invalid pin.");

  if (otp.expiresAt < Date.now())
    return res.status(400).send("OTP is expired.");

  const user = await Customer.findOne({ phone: req.body.phone });
  if (!user) return res.status(404).send("User cannot found.");

  user.active = true;
  await user.save();

  const token = user.generateAuthToken();

  await OTP.deleteMany({ phone });

  res.send(token);
};

module.exports.generateOTP = generateOTP;
module.exports.verifyOTP = verifyOTP;
