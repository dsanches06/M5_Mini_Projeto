import { UserClass } from "../../models/index.js";
import Notifications from "../../notifications/Notifications.js";
import { NotificationAPIResponse, UserAPIResponse } from "./index.js";

/** Converter objeto plano para instância de UserClass */
export function mapToUserClass(data: UserAPIResponse): UserClass {
  return new UserClass(
    data.id,
    data.name,
    data.email,
    data.phone,
    data.gender,
    getStatus(data.active),
    data.role,
  );
}

/** Converter objeto plano para instância de Notifications */
export function mapToNotifications(
  data: NotificationAPIResponse,
): Notifications {
  return new Notifications(
    data.id,
    data.title,
    data.message,
    data.is_read,
    data.sent_at,
  );
}

/** Converter status numérico para booleano */
export function getStatus(status: number): boolean {
  return status === 1 ? true : false;
}
