import { UserRole } from "../security/UserRole.js";
import { ITask } from "../tasks/index.js";

/* Interface que define o contrato para um utilizador */
export interface IUser {
  getId(): number;
  getName(): string;
  isActive(): boolean;
  toggleActive(): void;
  getRole(): UserRole;
  getEmail(): string;
  createTask(task: ITask): void;
  removeTask(id: number): void;
  pendingTasks(): ITask[];
  completedTasks(): ITask[];
  getTasks(): ITask[];
}
