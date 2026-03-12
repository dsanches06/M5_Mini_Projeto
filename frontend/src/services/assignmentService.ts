import { TaskStatus } from "../tasks/TaskStatus.js";
import { UserService, TaskService } from "./index.js";

/* Serviço para gerir a atribuição de tarefas a utilizadores */
export class AssignmentService {
  static assignUser(taskId: number, userId: number) {
    const task = TaskService.getTaskById(taskId);
    const user = UserService.getUserById(userId);
    if (task && user) {
      const prevUser = task.getUser();
      if (prevUser && prevUser.getId() !== user.getId()) {
        const idx = prevUser.getTasks().findIndex((t) => t.getId() === taskId);
        if (idx !== -1) prevUser.getTasks().splice(idx, 1);
      }
      const alreadyAssigned = user.getTasks().find((t) => t.getId() === taskId);
      if (!alreadyAssigned) {
        user.getTasks().push(task);
        task.setUser(user);
        task.moveTo(TaskStatus.ASSIGNED);
      }
    }
  }

  /* Remove a atribuição de uma tarefa a um utilizador */
  static unassignUser(taskId: number, userId: number) {
    const task = TaskService.getTaskById(taskId);
    const user = UserService.getUserById(userId);
    if (task && user) {
      const taskIndex = user.getTasks().findIndex((t) => t.getId() === taskId);
      if (taskIndex !== -1) {
        user.getTasks().splice(taskIndex, 1);
        task.setUser(undefined);
        task.moveTo(TaskStatus.CREATED);
      }
    }
  }

  /* Obtém o utilizador atribuído a uma tarefa específica */
  static getUserFromTask(taskId: number) {
    const task = TaskService.getTaskById(taskId);
    return task ? task.getUser() : null;
  }

  /* Obtém todas as tarefas atribuídas a um utilizador específico */
  static getTasksFromUser(userId: number) {
    const user = UserService.getUserById(userId);
    return user ? user.getTasks() : [];
  }
}
