import { StateTransitions } from "../utils/index.js";
import { IUser, BaseEntity } from "../models/index.js";
import { ITask } from "./index.js";
import { TaskCategory } from "./TaskCategory.js";
import { TaskStatus } from "./TaskStatus.js";
import { SystemLogger } from "../logs/SystemLogger.js";

/* Implementação da tarefa genérica */
export class Task extends BaseEntity implements ITask {
  private title: string;
  private description?: string;
  private completed: boolean;
  private completeDate?: Date;
  private status: TaskStatus;
  private category: TaskCategory;
  private user: IUser | undefined;

  constructor(id: number, title: string, description: string | undefined, category: TaskCategory) {
    super(id);
    this.title = title;
    this.description = description;
    this.completed = false;
    this.status = TaskStatus.CREATED;
    this.category = category;
    this.user = undefined;
  }

  getCreatedAt(): Date {
    return super.getCreatedAt();
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
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

  getType(): string {
    return "Task";
  }

  getUser(): IUser | undefined {
    return this.user;
  }

  setUser(user: IUser | undefined): void {
    this.user = user;
  }

  getTaskCategory(): TaskCategory {
    return this.category;
  }

  getCompletedDate(): Date {
    return this.completeDate!;
  }

  setCompletedDate(date: Date): void {
    this.completeDate = date;
  }

  markCompleted(): void {
    this.completed = true;
    this.setCompletedDate(new Date());
  }

  moveTo(status: TaskStatus): void {
    try {
      const canTransition = StateTransitions.validTransitions(
        this.getStatus(),
        status,
      );
      // Validar transição
      if (canTransition) {
        SystemLogger.log(
          `INFO: Transição permitida de ${TaskStatus[this.getStatus()]} para ${TaskStatus[status]}.`,
        );
        this.setStatus(status);
        if (status === TaskStatus.COMPLETED) {
          this.markCompleted();
          this.setCompletedDate(new Date());
        }
      }
    } catch (error) {
      SystemLogger.log(
        `ERRO: Transição de ${TaskStatus[this.getStatus()]} para ${TaskStatus[status]} não é permitida. ${error}`,
      );
    }
  }
}
