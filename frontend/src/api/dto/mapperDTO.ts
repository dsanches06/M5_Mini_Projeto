import { Project } from "../../projects/index.js";
import { UserClass } from "../../models/index.js";
import Notifications from "../../notifications/Notifications.js";
import { getStatus, parseDate } from "../../api/utils/utils.js";
import {
  NotificationAPIResponse,
  ProjectAPIResponse,
  UserAPIResponse,
  TaskAPIResponse,
  TaskAssigneeAPIResponse,
} from "./index.js";
import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js"
import { BaseEntity } from "../../models/index.js";

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

/** Converter objeto plano para instância de ITask (SimpleTask) */
export function mapToTask(data: TaskAPIResponse): ITask {
  return new SimpleTask(
    data.id,
    data.title,
    data.description || "",
    getStatus(data.status_id!) === true,
    data.status_id ? getTaskStatusFromId(data.status_id) : TaskStatus.CREATED,
  );
}

/** Classe simples que implementa ITask para dados da API */
class SimpleTask extends BaseEntity implements ITask {
  private title: string;
  private description: string;
  private completed: boolean;
  private status: TaskStatus;
  private assignees: TaskAssigneeAPIResponse[] = [];

  constructor(
    id: number,
    title: string,
    description: string,
    completed: boolean,
    status: TaskStatus,
  ) {
    super(id);
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.status = status;
  }

  getId(): number {
    return super.getId();
  }

  getCreatedAt(): Date {
    return super.getCreatedAt();
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getTitle(): string {
    return this.title;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getCompleted(): boolean {
    return this.completed;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  setStatus(status: TaskStatus): void {
    this.status = status;
  }

  getUser() {
    return undefined;
  }

  setUser() {}

  getType(): string {
    return "Task";
  }

  getCompletedDate(): Date {
    return new Date();
  }

  getTaskCategory() {
    return {} as any;
  }

  markCompleted(): void {
    this.completed = true;
  }

  moveTo(status: TaskStatus): void {
    this.status = status;
  }

  /* Obter lista de assignees desta tarefa */
  getAssignees(): TaskAssigneeAPIResponse[] {
    return this.assignees;
  }

  /* Definir lista de assignees desta tarefa */
  setAssignees(assignees: TaskAssigneeAPIResponse[]): void {
    this.assignees = assignees;
  }
}

/** Converter status_id para TaskStatus enum */
function getTaskStatusFromId(statusId: number): TaskStatus {
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
