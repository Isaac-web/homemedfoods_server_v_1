const axios = require("axios");

const sendSms = async (tel, message) => {
  url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=OjZaajgzRTVjbVdwU0xISko=&to=${tel}&from=SenderID&sms=${message}`;
  const res = await axios.get("https://www.google.com");
  console.log(res.status, res.text);
};

const sendOTP = async (number) => {
  const headers = {
    "api-key": "OjZaajgzRTVjbVdwU0xISko=",
  };
  const data = {
    expiry: 5,
    length: 6,
    medium: "sms",
    message: "Verification Code - %otp_code%",
    number: number,
    sender_id: "Digimart",
    type: "numeric",
  };

  const res = await axios.post(
    "https://sms.arkesel.com/api/otp/generate",
    data,
    { headers }
  );
  console.log(res.status, res.data);
};

// sendSms("233553039567", "Test successful.");
sendOTP("233553039567");
