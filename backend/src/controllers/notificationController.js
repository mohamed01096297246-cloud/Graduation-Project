const Notification = require("../models/Notification");
const User = require("../models/User");
const sendCredentialsEmail = require("../utils/emailService.js");

exports.createNotification = async (req, res) => {
  try {
    const { title, message, target, parentId } = req.body;

    if (target === "parent" && !parentId) {
      return res.status(400).json({
        message: "parentId is required when target is parent"
      });
    }

    const notification = await Notification.create({
      title,
      message,
      target: target || "all",
      parent: target === "parent" ? parentId : null,
      createdBy: req.user._id
    });


    if (target === "all" || !target) {
      const parents = await User.find({ role: "parent" });

      for (let p of parents) {
        if (p.email) {
          await sendCredentialsEmail(p.email, title, message);
        }
      }
    }

    if (target === "parent") {
      const parentUser = await User.findById(parentId);

      if (parentUser && parentUser.email) {
        await sendCredentialsEmail(parentUser.email, title, message);
      }
    }

    res.status(201).json({
      message: "Notification created successfully",
      notification
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getParentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { target: "all" },
        { target: "parent", parent: req.user._id }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name role");

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};