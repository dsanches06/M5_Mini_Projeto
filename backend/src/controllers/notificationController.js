import * as notificationService from "../services/notificationService.js";

/* */
export const getNotifications = (req, res) => {
  try {
    const notifications = notificationService.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    res.json({ message: `${error}` });
  }
};

/* */
export const createNotification = (req, res) => {
  try {
    const notification = notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.json({ message: `${error}` });
  }
};

/* */
export const updateNotification = (req, res) => {
  try {
    const notification = notificationService.updateNotification(
      Number(req.params.id),
      req.body,
    );
    res.json(notification);
  } catch (error) {
    res.json({ message: `${error}` });
  }
};

/* */
export const deleteNotification = (req, res) => {
  try {
    notificationService.deleteNotification(Number(req.params.id));
    res.json({ message: `Notification deleted successfully` });
  } catch (error) {
    res.json({ message: `${error}` });
  }
};
