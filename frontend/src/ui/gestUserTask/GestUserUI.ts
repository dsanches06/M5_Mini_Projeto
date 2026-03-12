import { showInfoBanner } from "../../helpers/infoBanner.js";
import { IUser } from "../../models/index.js";
import {
  AssignmentService,
  TaskService,
  UserService,
} from "../../services/index.js";
import { clearContainer } from "../dom/index.js";
import { loadUsersPage } from "../users/index.js";

/* Função principal para carregar utilizadores iniciais */
export function loadInitialUsers(): void {
  //Limpa o container antes de mostrar os utilizadores
  clearContainer("#containerSection");
  // carrega a pagina dinamica de utilizadores
  loadUsersPage(UserService.getAllUsers());
}

/* Remover utilizador */
export function removeUserByID(id: number) {
  return UserService.removeUser(id);
}

/* Alternar estado (ativo / inativo) */
export function toggleUserState(id: number): void {
  //encontra o utilizador pelo ID
  const user = UserService.getUserById(id);
  //se o utilizador for encontrado
  if (user) {
    //alternar o estado
    user.toggleActive();
    //para ativo
    if (user.isActive()) {
      showInfoBanner(
        `O utilizador "${user.getName()}" está agora ativo.`,
        "info-banner",
      );
    } else {
      //todas as tarefas serão processadas
      const tasksToRemove = [...user.getTasks()];

      if (tasksToRemove.length === 0) {
        showInfoBanner(
          `O utilizador "${user.getName()}" não tem tarefas a cancelar.`,
          "info-banner",
        );
      } else {
        for (const task of tasksToRemove) {
          if (!task.getCompleted()) {
            //se não tiver completa, desassignar
            unassigUserTask(user, task.getId());
          }
          //remover tarefa do utilizador
          user.removeTask(task.getId());
          //remover tarefa do sistema
          TaskService.removeTask(task.getId());
        }

        if (!user.isActive()) {
          showInfoBanner(
            `Todas as tarefas do utilizador "${user.getName()}" foram canceladas porque está inactivo.`,
            "info-banner",
          );
        }
      }
    }
  }
}

export function getActiveUsers(users: IUser[]): IUser[] {
  return users.filter((user) => user.isActive());
}

export function getInactiveUsers(users: IUser[]): IUser[] {
  return users.filter((user) => !user.isActive());
}

/* Procurar utilizador por nome */
export function searchUserByName(name: string): IUser[] {
  const lowerCaseName = name.toLowerCase();
  return UserService.getAllUsers().filter((user) =>
    user.getName().toLowerCase().includes(lowerCaseName),
  );
}

/* Ordenar utilizadores por nome */
export function sortUsersByName(ascending: boolean = true): IUser[] {
  const sortedUsers = [...UserService.getAllUsers()];
  if (ascending) {
    sortedUsers.sort((a, b) => a.getName().localeCompare(b.getName()));
  } else {
    sortedUsers.sort((a, b) => b.getName().localeCompare(a.getName()));
  }
  return sortedUsers;
}

export function unassigUserTask(user: IUser, taskId: number): void {
  AssignmentService.unassignUser(taskId, user.getId());
}
