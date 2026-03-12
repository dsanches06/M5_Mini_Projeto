import { TaskStatus } from "../tasks/TaskStatus.js";
import { UserService } from "./index.js";

/* Serviço para fornecer estatísticas sobre usuários e tarefas */
export class StatisticsService {
  countUsers(): number {
    return UserService.getAllUsers().length;
  }

  countTasks(): number {
    return UserService.getAllUserTasks().length;
  }

  countCompletedTasks(): number {
    return UserService.getAllUserTasks().filter((task) => task.getCompleted())
      .length;
  }

  countActiveTasks(): number {
    return UserService.getAllUserTasks().filter((task) => !task.getCompleted())
      .length;
  }

  tasksByStatus(status: TaskStatus): number {
    return UserService.getAllUserTasks().filter(
      (task) => task.getStatus() === status,
    ).length;
  }
}
