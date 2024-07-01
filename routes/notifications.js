const Joi = require('joi');
const express = require('express');
const { Customer } = require('../models/Customer');
const {
  sendPushNotification,
  getServerKey,
} = require('../utils/pushNotification');

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

router.post('/send', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await sendPushNotification({
      token: req.body.to,
      title: req.body.title,
      message: req.body.message,
      serverKey: getServerKey(req.body.appName),
    });
    res.send({
      message: 'Notification was successfully sent.',
      payload: response,
    });
  } catch (error) {
    res.send({
      message: 'Failed to send notification.',
      error,
    });
  }
});

router.post('/send-to-all-customers', async (req, res) => {
  const customers = await Customer.find();

  customers.forEach(async (c) => {
    if (Array.isArray(c.devices) && c?.devices?.length) {
      const token = c.devices[0]?.notificationData?.token;
      const appName = c.devices[0]?.notificationData?.appName;
      const message = req.body.message;
      const title = req.body.title;
      const serverKey = process.env.CUSTOMER_FCM_SERVER_KEY;

      if (!serverKey || !token || !title || !message || !token) return;

      try {
        sendPushNotification({
          token: token,
          title,
          message,
          serverKey: getServerKey('customer'),
        }).catch((err) => {
          console.log(err);
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  res.json({
    message: 'Message sent.',
  });
});

module.exports = router;
