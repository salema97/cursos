const express = require("express");
const { verifyRole } = require("../middlewares/auth.jwt");
const NotificationControllers = require("../controllers/notification.controllers");

const router = express.Router();

router.post(
  "/send-notification/:userId",
  verifyRole("Admin"),
  NotificationControllers.sendNotification
);

router.post(
  "/send-notification-to-all",
  verifyRole("Admin"),
  NotificationControllers.sendNotificationToAll
);

module.exports = router;
