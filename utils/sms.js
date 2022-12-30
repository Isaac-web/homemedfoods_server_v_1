const axios = require("axios");

const apiKey = "OjZaajgzRTVjbVdwU0xISko=";
const api = axios.create({
  baseURL: "https://sms.arkesel.com/api",
  headers: { "api-key": apiKey },
});

const sendSms = async (number, message) => {
  
  let recipients;
  if(typeof number === "string") recipients = [number]
  else if (number instanceof Array) recipients = number;
  
  console.log(recipients);
  const url = `/v2/sms/send`;
  const data = {
    sender: "Digimart",
    message,
    recipients,
  };

  const res = await api.request({
    data,
    method: "post",
    url,
  });

  return res.status;
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

  console.log(res.status);
  return res.status;
};

console.log(sendSms(["233553039567", "233244103657", "233246901226"], "Make you no stress. We dey for you"));
// generateOTP("233553039567");
// verifyOTP("233553039567", 324702);



