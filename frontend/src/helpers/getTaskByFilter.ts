import { UserService } from "../services/index.js";
import { ITask } from "../tasks/index.js";
import { showInfoBanner } from "./index.js";

/* Função para obter tarefas por filtro */
export function getUserTasksByFilter(filter: string, title?: string): ITask[] {
  let tasks: ITask[] = [];
  for (const task of UserService.getAllUserTasks()) {
    switch (filter) {
      case "all":
        tasks.push(task);
        break;
      case "pending":
        if (!task.getCompleted()) {
          tasks.push(task);
        }
        break;
      case "completed":
        if (task.getCompleted()) {
          tasks.push(task);
        }
        break;
      case "search":
        if (
          task
            .getTitle()
            .toLowerCase()
            .includes(title || "")
        ) {
          tasks.push(task);
        }
        break;
      default:
        showInfoBanner("Filtro desconhecido", "error-banner");
        break;
    }
  }
  return tasks;
}
