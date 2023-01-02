const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.ng.termii.com/api",
});

const sendOTP = async (number) => {
  try {
    const res = await api.request({
      method: "post",
      url: "/sms/otp/send",
      data: {
        api_key:
          "TLA4nz5OcWbJlWJP1HmE14mH2JhxI21NWwvua2535hjzP8zeeJPD2mIPrN3BLy",
        message_type: "NUMERIC",
        to: "number",
        from: "Digimart",
        channel: "generic",
        pin_attempts: 5,
        pin_time_to_live: 5,
        pin_length: 6,
        pin_placeholder: "< 1234 >",
        message_text: "< 1234 > is your Digimart verification code.",
        pin_type: "NUMERIC",
      },
    });

    console.log(res);
  } catch (err) {
    if (err.response) {
      console.log("Error: ", err.response.status);
    } else console.log("Error: ", err.data);
  }
};

const verifyOTP = async (pin_id, pin) => {
  const res = await api.request({
    method: "post",
    url: "/sms/otp/verify",

    data: {
      api_key: "TLA4nz5OcWbJlWJP1HmE14mH2JhxI21NWwvua2535hjzP8zeeJPD2mIPrN3BLy",
      pin_id,
      pin,
    },
  });

  console.log(res);
};

sendOTP("233553039567");

// verifyOTP("< pin_id >", "< pin >");

module.exports.sendOTP = sendOTP;
module.exports.verifyOTP = verifyOTP;
