import * as notificationService from "../services/notificationService.js";

export const getNotifications = (req, res) => {
  const notifications = notificationService.getAllNotifications();
  res.json(notifications);
};

export const createNotification = (req, res) => {
  const notification = notificationService.createNotification(req.body);
  res.status(201).json(notification);
};

export const updateNotification = (req, res) => {
  const notification = notificationService.updateNotification(Number(req.params.id), req.body);
  res.json(notification);
};

export const deleteNotification = (req, res) => {
  notificationService.deleteNotification(Number(req.params.id));
  res.json({ message: "Notification deleted successfully" });
};
