import { ITask } from "../tasks/index.js";
import { TaskStatus } from "../tasks/TaskStatus.js";

/* Serviço para gerir tarefas */
export class TaskService {
  private static tasks = new Map<number, ITask>();

  /* Adiciona uma nova tarefa ao serviço */
  static addTask(task: ITask): void {
    if (!this.tasks.has(task.getId())) {
      this.tasks.set(task.getId(), task);
    }
  }

  /* Remove uma tarefa do serviço pelo ID */
  static removeTask(id: number): boolean {
    return this.tasks.delete(id);
  }

  /* Obtém todas as tarefas não concluídas */
  static getAllTasks(): ITask[] {
    return Array.from(this.tasks.values());
  }

  static getTaskById(id: number): ITask | undefined {
    return this.tasks.get(id);
  }

  /* Obtém todas as tarefas atribuídas */
  static getTasksAssign(): ITask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.getStatus() === TaskStatus.ASSIGNED,
    );
  }

  /* Obtém todas as tarefas não atribuídas */
  static getTasksUnassign(): ITask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.getUser() === undefined,
    );
  }
}
