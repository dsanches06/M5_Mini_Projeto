let notifications = [];
let id = 0;

export const getAllNotifications = () => {
  return notifications;
};

export const createNotification = (data) => {
  const notification = {
    id: id++,
    message: data.message,
    date: data.date,

  };
  notifications.push(notification);
  return notification;
};

export const updateNotification = (notificationId, data) => {
  const notification = notifications.find((n) => n.id === notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.message = data.message ?? notification.message;
  notification.date = data.date ?? notification.date;

  return notification;
};

export const deleteNotification = (notificationId) => {
  notifications = notifications.filter((n) => n.id !== notificationId);
};
