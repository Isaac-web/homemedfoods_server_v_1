const Joi = require("joi");
const express = require("express");
const { sendPushNotification, getServerKey } = require("../utils/pushNotification");

const router = express.Router();

const validate = (notification) => {
  const schema = Joi.object({
    to: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    appName: Joi.string().required(),
  });

  return schema.validate(notification);
};
router.post("/send", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await sendPushNotification({
      token: req.body.to,
      title: req.body.title,
      message: req.body.message,
      serverKey: getServerKey(req.body.appName),
    });
    res.send(
      {
        message: "Notification was successfully sent.",
        payload: response
      }
    );
  } catch (error) {
    res.send(
      {
        message: "Failed to send notification.",
        error
      }
    );
  }
});

module.exports = router;
