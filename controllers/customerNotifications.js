const { CustomerNotification } = require("../models/CustomerNotification");

const getCustomerNotifications = async (req, res) => {
  const [notifications, count] = await Promise.all([
    CustomerNotification.find({
      userId: req.customer._id,
    }),
    CustomerNotification.find({ userId: req.customer._id }).count(),
  ]);

  res.send({ notifications, count });
};

const deleteNoticiation = async (req, res) => {
  const notification = await CustomerNotification.findByIdAndRemove(
    req.params.id
  );
  if (!notification)
    return res.status(404).send("Looks like the notification cannot be found.");

  res.send(notification);
};

const getNotification = async (req, res) => {
  const notification = await CustomerNotification.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        viewed: true,
      },
    },
    { new: true }
  );

  if (!notification)
    return res.status(404).send("Looks like the notification cannot be found.");

  res.send(notification);
};

exports.getCustomerNotifications = getCustomerNotifications;
exports.deleteNoticiation = deleteNoticiation;
exports.getNotification = getNotification;
