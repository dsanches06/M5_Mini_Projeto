import { ITask } from "../../tasks/index.js";
import { IUser } from "../../models/index.js";
import { TaskDashboardUI } from "../tasks/index.js";
import { addElementInContainer } from "../dom/index.js";
import { showTasksCounters } from "../tasks/index.js";

/* Renderiza o dashboard de tarefas */
export async function renderDashboard(
  tasks: ITask[],
  user?: IUser,
  type?: string,
): Promise<void> {
  // Nota: showTasksCounters já foi chamada em TaskPageUI.ts
  // NÃO chamar novamente aqui para evitar recarregar todas as tasks
  showTaskDashboardUI(tasks, user);
}

function showTaskDashboardUI(tasks: ITask[], user?: IUser): void {
  const existing = document.querySelector("#dashBoardContainer");
  // Sempre usa TaskDashboardUI e passa as tasks, independentemente de ter user
  const dashboard = new TaskDashboardUI(tasks);
  const rendered = dashboard.render();
  if (!existing) {
    addElementInContainer("#containerSection", rendered);
  }
}
