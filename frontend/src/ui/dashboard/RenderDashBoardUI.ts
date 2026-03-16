import { ITask } from "../../tasks/index.js";
import { IUser } from "../../models/index.js";
import { UsersDashboard } from "../users/index.js";
import { TaskDashboardUI } from "../tasks/index.js";
import { addElementInContainer } from "../dom/index.js";
import { showTasksCounters } from "../tasks/index.js";

/* Renderiza o dashboard de tarefas */
export function renderDashboard(
  tasks: ITask[],
  user?: IUser,
  type?: string,
): void {
  showTasksCounters(tasks, type);
  showTaskDashboardUI(tasks, user);
}

function showTaskDashboardUI(tasks: ITask[], user?: IUser): void {
  const existing = document.querySelector("#dashBoardContainer");
  const dashboard = user
    ? new UsersDashboard(user)
    : new TaskDashboardUI(tasks);
  const rendered = dashboard.render();
  if (!existing) {
    addElementInContainer("#containerSection", rendered);
  }
}
