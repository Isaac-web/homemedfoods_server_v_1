const Joi = require("joi");
const express = require("express");
const { sendPushNotification } = require("../utils/pushNotification");

const router = express.Router();

const validate = (notification) => {
  const schema = Joi.object({
    to: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
  });

  return schema.validate(notification);
};
router.post("/send", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

<<<<<<< HEAD
  const response = await sendPushNotification({
    token: req.body.to,
    title: req.body.title,
    message: req.body.message,
    serverKey: req.body.serverKey,
  });
=======
  try {
    const serverKey = process.env.CUSTOMER_FCM_SERVER_KEY;
    const response = await sendPushNotification({
      to: req.body.to,
      title: req.body.title,
      message: req.body.message,
      serverKey,
    });
    res.send(
      {
        message: "Notification was successfully sent",
        payload: response
      }
    );
  } catch (error) {
    res.send(
      {
        message: "Failed to send notification",
        error
      }
    );
  }
>>>>>>> notification

});

module.exports = router;
