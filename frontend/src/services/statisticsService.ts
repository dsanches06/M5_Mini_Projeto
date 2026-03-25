import { get } from "node:http";
import { TaskStatus } from "../tasks/TaskStatus.js";
import { TaskService, UserService } from "./index.js";

/* Serviço para fornecer estatísticas sobre usuários e tarefas */
export class StatisticsService {
  async getUserStats() {
    return await UserService.getUserStats();
  }

  async getTaskStats() {
    return await TaskService.getTaskStats();
  }
}
