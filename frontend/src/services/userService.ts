import { IUser } from "../models/index.js";
import { ITask } from "../tasks/index.js";

/* Serviço para gerir usuários */
export class UserService {
  private static users = new Map<number, IUser>();

  /* Adiciona um novo usuário ao serviço */
  static addUser(user: IUser): void {
    if (!this.users.has(user.getId())) {
      this.users.set(user.getId(), user);
    }
  }

  /* Remove um usuário do serviço pelo ID */
  static removeUser(id: number): boolean {
    return this.users.delete(id);
  }

  /* Obtém todos os usuários registrados */
  static getAllUsers(): IUser[] {
    return Array.from(this.users.values());
  }

  /* Obtém um usuário pelo ID */
  static getUserById(id: number): IUser | undefined {
    return this.users.get(id);
  }

  /*  Obtém um usuário pelo ID de uma tarefa atribuída */
  static getUserByTaskId(id: number): IUser | undefined {
    for (const user of this.users.values()) {
      const task = user.getTasks().find((t) => t.getId() === id);
      if (task) {
        return user;
      }
    }
    return undefined;
  }

  /* Obtém todas as tarefas de todos os usuários */
  static getAllUserTasks(): ITask[] {
    const users = this.getAllUsers();
    const allTasks: ITask[] = [];
    users.forEach((user) => {
      allTasks.push(...user.getTasks());
    });
    return allTasks;
  }
}
