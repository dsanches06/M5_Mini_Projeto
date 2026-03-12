import { SystemLogger } from "../logs/SystemLogger.js";
import { ITask } from "../tasks/index.js";
import { TaskStatus } from "../tasks/TaskStatus.js";
import { IUser } from "../models/index.js";
import {
  DeadlineService,
  AssignmentService,
  NotificationService,
} from "./index.js";

/* Serviço para aplicar regras automáticas de tarefas */
export class AutomationRulesService {
  /* Aplica regras automáticas relacionadas a tarefas */
  static applyRules(task: ITask) {
    if (task.getStatus() === TaskStatus.COMPLETED) {
      SystemLogger.log(
        `INFO: Task ${task.getId()} foi completada em ${new Date().toLocaleString("pt-PT")}.`,
      );
    } else if (task.getStatus() === TaskStatus.BLOCKED) {
      const assignedUser = task.getUser();
      if (assignedUser) {
        NotificationService.notifyUser(
          assignedUser.getId(),
          `O seu task ${task.getTitle()} está ${TaskStatus.BLOCKED.toString()}. Por favor, verifique.`,
        );
      }
    } else if (DeadlineService.isExpired(task.getId())) {
      task.moveTo(TaskStatus.BLOCKED);
      SystemLogger.log(
        `INFO: Tarefa ${task.getId()} foi movido para ${TaskStatus.BLOCKED.toString()} devido à expiração do prazo.`,
      );
    }
  }

  /* Aplica regras automáticas relacionadas a usuários */
  static applyUserRules(user: IUser) {
    if (!user.isActive()) {
      const tasks = AssignmentService.getTasksFromUser(user.getId());
      tasks.forEach((task: ITask) => {
        AssignmentService.unassignUser(task.getId(), user.getId());
      });
    }
  }
}
