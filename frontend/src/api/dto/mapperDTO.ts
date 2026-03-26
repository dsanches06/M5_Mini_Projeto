import { Project } from "../../projects/index.js";
import { UserClass } from "../../models/index.js";
import Notifications from "../../notifications/Notifications.js";
import {
  getStatus,
  getTaskStatusFromId,
  parseDate,
} from "../../api/utils/index.js";
import {
  NotificationAPIResponse,
  ProjectAPIResponse,
  UserAPIResponse,
  TaskAPIResponse,
} from "./index.js";
import { ITask } from "../../tasks/index.js";
import { Task } from "../../tasks/Task.js";
import { TaskCategory } from "../../tasks/TaskCategory.js";

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

/* Função auxiliar para mapear dados da API para instâncias de Project */
export function mapToProject(data: ProjectAPIResponse): Project {
  return new Project(
    data.id,
    data.name,
    data.description!,
    data.project_status_id!,
    parseDate(data.created_at),
    parseDate(data.end_date_expected),
  );
}

/** Converter objeto plano para instância de ITask (Task) */
export function mapToTask(data: TaskAPIResponse): ITask {
  // Criar um projeto dummy com dados mínimos
  const project = new Project(
    data.project_id || 0,
    `Project ${data.project_id}`,
    "Project from API",
    0,
    new Date(),
    new Date(),
  );

  // Criar uma categoria dummy com dados mínimos
  const category = {
    getId: () => data.category_id || 0,
    getName: () => `Category ${data.category_id}`,
  } as unknown as TaskCategory;

  // Criar tarefa usando a classe Task real
  const task = new Task(
    data.id,
    data.title,
    data.description || "",
    category,
    project,
  );

  // Definir o status da tarefa
  task.setStatus(getTaskStatusFromId(data.status_id!));

  // Se a tarefa foi marcada como concluída, definir isso
  if (data.completed_at) {
    task.markCompleted();
  }

  return task as ITask;
}
