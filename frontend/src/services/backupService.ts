import { UserService, TaskService } from "./index.js";

/* Serviço para backup de dados */
export class BackupService {
  exportUsers() {
    return JSON.stringify(UserService.getAllUsers());
  }
  exportTasks() {
    return JSON.stringify(TaskService.getAllTasks());
  }

  exportAssignments() {
    const assignments = TaskService.getAllTasks().map((task) => ({
      taskId: task.getId(),
      assignedTo: task.getUser()?.getId() ?? null,
    }));
    return JSON.stringify(assignments);
  }

  exportAll() {
    return {
      users: this.exportUsers(),
      tasks: this.exportTasks(),
      assignments: this.exportAssignments(),
    };
  }
}
