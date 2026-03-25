import { IUser } from "../models/index.js";
import { ITask } from "../tasks/index.js";
import { getUsers } from "../api/index.js";

/* Serviço para gerir usuários */
export class UserService {
  private static users = new Map<number, IUser>();

  /* Adiciona um novo usuário ao serviço */
  static addUser(user: IUser): void {}

  /* Remove um usuário do serviço pelo ID */
  static removeUser(id: number): boolean {
    return false;
  }

  /* Obtém todos os usuários registrados */
  static  getAllUsers(): IUser[] {
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
    return [];
  }
}
