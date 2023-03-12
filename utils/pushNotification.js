const FCM = require("fcm-node");
const config = require("config");



module.exports.sendPushNotification = async (
  to,
  title,
  message,
  appName = "Digimart"
) => {
  const fcm = new FCM(getFCMServerKey(appName));
  const messageObject = {
    to,
    notification: {
      title,
      body: `{${message}}`,
    },

    data: {
      //you can send only notification or only data(or include both)
      title: "ok cdfsdsdfsd",
      body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}',
    },
  };

  try {
    await fcm.send(messageObject);
  } catch (err) {
    // console.log("There was an error.");
  }
};

const getFCMServerKey = (appName) => {
  switch (appName) {
    case "DigimartShopper":
      return config.get("fcm.shopperAppServerKey");
    case "DigimartRider":
      return config.get("riderAppServerKey");
    case "Digimart":
      return config.get("customerAppServerKey");
  }
};
