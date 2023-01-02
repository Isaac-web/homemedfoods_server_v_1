const { sendSms } = require("../utils/sms");
const { Customer } = require("../models/Customer");
const generateUniqueId = require("generate-unique-id");

const generateOTP = async (req, res) => {
  const phone = req.body.phone;
  if (!phone) return res.status(400).send("Phone number is required.");

  //make otp request
  const otpString = generateUniqueId({
    length: 7,
    useLetters: false,
  });

  const status = await sendSms(
    "+233553039567",
    `${otpString} 
    is your Digimart verification code. It is active for 7 minutes and can be used only once.`
  );

  if (status != 200)
    return res.status(500).send("An error occured while sending an SMS.");

  res.send({ message: "OTP has been sent successfully." });
};

const verifyOTP = async (req, res) => {
  const phone = req.body.phone;
  if (!phone) return res.status(400).send("Phone number is required.");

  //request top verification

  const user = await Customer.findOne({ phone: req.body.phone });
  if (!user) return res.status(404).send("User cannot found.");

  const token = user.generateAuthToken();

  res.send(token);
};

module.exports.generateOTP = generateOTP;
module.exports.verifyOTP = verifyOTP;
