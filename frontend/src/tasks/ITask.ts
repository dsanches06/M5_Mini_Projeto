import { IUser } from "../models/index.js";
import { TaskCategory } from "./TaskCategory.js";
import { TaskStatus } from "./TaskStatus.js";

/* Interface que define o contrato para uma tarefa */
export interface ITask {
  getId(): number;
  getCreatedAt(): Date;
  setTitle(title: string): void;
  getTitle(): string;
  setDescription(description: string): void;
  getDescription(): string | undefined;
  getCompleted(): boolean;
  getStatus(): TaskStatus;
  setStatus(status: TaskStatus): void;
  getUser(): IUser | undefined;
  setUser(user: IUser | undefined): void;
  getType(): string;
  getCompletedDate(): Date;
  getTaskCategory(): TaskCategory;
  markCompleted(): void;
  moveTo(status: TaskStatus): void;
}
