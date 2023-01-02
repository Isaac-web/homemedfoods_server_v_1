const axios = require("axios");

const apiKey = process.env.ARKESEL_API_KEY;
const api = axios.create({
  baseURL: "https://sms.arkesel.com/api",
  headers: { "api-key": apiKey },
});

const sendSms = async (number, message) => {
  let recipients;
  if (typeof number === "string") recipients = [number];
  else if (number instanceof Array) recipients = number;

  const url = `/v2/sms/send`;
  const data = {
    sender: "Digimart",
    message,
    recipients,
  };

  try {
    const res = await api.request({
      data,
      method: "post",
      url,
    });

    return res.status;
  } catch (err) {
    if (err.response) return err.response.status;

    return 500;
  }
};

const generateOTP = async (number) => {
  const data = {
    expiry: 5,
    length: 6,
    medium: "sms",
    message: "%otp_code% is your Digimart verification code.",
    number,
    sender_id: "Digimart",
    type: "numeric",
  };

  try {
    const res = await api.request({
      data,
      method: "post",
      url: "/otp/generate",
    });

    console.log(res.status, res.data);
  } catch (err) {
    console.log(err.response.data);
  }
};

const verifyOTP = async (number, code) => {
  const data = {
    api_key: apiKey,
    code: code?.toString(),
    number,
  };

  const res = await api.request({
    data,
    method: "post",
    url: "/otp/verify",
  });

  return res.status;
};

exports.sendSms = sendSms;
exports.verifyOTP = verifyOTP;


