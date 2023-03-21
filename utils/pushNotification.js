const FCM = require("fcm-node");

const sendPushNotification = ({ to, title, message, serverKey }) => {
  const fcm = new FCM(serverKey);

  const pushScription = {
    to,
    notification: {
      title,
      body: message,
    },
  };

  return new Promise((resolve, reject) => {
    fcm.send(pushScription, (err, res) => {
      if (err) reject(err);

      resolve(res);
    });
  });
};

module.exports.sendPushNotification = sendPushNotification;
