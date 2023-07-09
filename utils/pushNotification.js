const FCM = require("fcm-node");
const config = require("config");

const sendPushNotification = ({ token, title, message, serverKey }) => {
  //Ensure parameters are provided
  if (!token) throw new Error("'token' is required.");
  if (!title) throw new Error("'title' is required..");
  if (!message) throw new Error("'message' is required.");
  if (!serverKey) throw new Error("'serverKey' was not provided.");


  //initialize firebase cloud messaging
  const fcm = new FCM(serverKey);


  //create push notification object
  const pushScription = {
    to: token,
    notification: {
      title,
      body: message,
    },
  };


  //send notitication and return the status of the promise
  return new Promise((resolve, reject) => {
    fcm.send(pushScription, (err, res) => {
      if (err) reject(err);

      resolve(res);
    });
  });
};


//helper function for getting the serverKey environment variable
const getServerKey = (appName) => {
  try {
    switch (appName) {
      case "shopper":
        return config.get("fcm.digimartShopperServerKey");
      case "rider":
        return config.get("fcm.digimartRiderServerKey");
      case "customer":
        return config.get("fcm.digimartCustomerServerKey");
      case "dashboard":
        return config.get("fcm.digimartDashboardServerKey");
      default:
        return null;
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
};


//module exports
module.exports.getServerKey = getServerKey;
module.exports.sendPushNotification = sendPushNotification;