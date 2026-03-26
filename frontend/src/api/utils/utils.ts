import { TaskStatus } from "../../tasks/TaskStatus.js";

/** Converter status numérico para booleano */
export function getStatus(status: number): boolean {
  return status === 1 ? true : false;
}

/* Função auxiliar para converter data seguramente */
export function parseDate(date: any): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === "string") {
    return new Date(date);
  }
  return new Date();
}

/** Converter status_id para TaskStatus enum */
export function getTaskStatusFromId(statusId: number): TaskStatus {
  const statusMap: { [key: number]: TaskStatus } = {
    1: TaskStatus.CREATED,
    2: TaskStatus.ASSIGNED,
    3: TaskStatus.IN_PROGRESS,
    4: TaskStatus.BLOCKED,
    5: TaskStatus.COMPLETED,
    6: TaskStatus.ARCHIVED,
  };
  return statusMap[statusId] || TaskStatus.CREATED;
}
