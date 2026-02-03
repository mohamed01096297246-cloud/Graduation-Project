const Notification = require("../models/Notification");

exports.createNotification = async (req, res) => {
  const { title, message, target, parentId } = req.body;

  const notification = await Notification.create({
    title,
    message,
    target: target || "all",
    parent: target === "parent" ? parentId : null,
    createdBy: req.user._id
  });

  res.status(201).json({
    message: "Notification created successfully",
    notification
  });
};

exports.getParentNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { target: "all" },
      { target: "parent", parent: req.user._id }
    ]
  }).sort({ createdAt: -1 });

  res.json(notifications);
};
