const Joi = require("joi");
const express = require("express");
const { sendPushNotification } = require("../utils/pushNotification");

const router = express.Router();

const validate = (notification) => {
  const schema = Joi.object({
    to: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    serverKey: Joi.string().required(),
  });

  return schema.validate(notification);
};
router.post("/send", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const response = await sendPushNotification({
    to: req.body.to,
    title: req.body.title,
    message: req.body.message,
    serverKey: req.body.serverKey,
  });

  res.send(response);
});

module.exports = router;
