const config = require("config");

module.exports = (app) => {
  process.on("uncaughtException", (err) => {
    console.log(err.message, err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    throw new Error(err);
  });

  if (app.get("env") === "production" && !config.get("auth.privateKey"))
    throw new Error("jwt privkate key not provided.");

  //   config.get("fcm.digimartShopperServerKey") &&
  //   config.get("fcm.digimartRiderServerKey")
  if (!config.get("fcm.digimartCustomerServerKey")) {
    throw new Error(
      "SHOPPER_FCM_SERVER_KEY, RIDER_FCM_SERVER_KEY or CUSTOMER_FCM_SERVER_KEY cannot be null."
    );
  }
};
