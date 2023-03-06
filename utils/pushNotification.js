const FCM = require("fcm-node");
const config = require("config");

var fcm = new FCM(config.get("fcm.serverKey"));

module.exports.sendPushNotification = async (to, title, message) => {
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
    console.log("There was an error.");
  }
};
