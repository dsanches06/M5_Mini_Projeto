import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";
import { renderModalEditTask } from "../modal/index.js";
import { getCardBorderColor, setCardBorderColor } from "../../helpers/index.js";
import { GenericDashboardUI } from "../dashboard/GenericDashboardUI.js";
import { DashboardColumn } from "../../dashboards/DashboardColumn.js";

export class TaskDashboardUI {
  private dashboard: GenericDashboardUI<ITask>;

  constructor(tasks: ITask[]) {
    const taskColumns: DashboardColumn<ITask>[] = [
      {
        id: TaskStatus.CREATED,
        label: "CREATED",
        filterFn: (task) => task.getStatus() === TaskStatus.CREATED,
      },
      {
        id: TaskStatus.ASSIGNED,
        label: "ASSIGNED",
        filterFn: (task) => task.getStatus() === TaskStatus.ASSIGNED,
      },
      {
        id: TaskStatus.BLOCKED,
        label: "BLOCKED",
        filterFn: (task) => task.getStatus() === TaskStatus.BLOCKED,
      },
      {
        id: TaskStatus.IN_PROGRESS,
        label: "IN_PROGRESS",
        filterFn: (task) => task.getStatus() === TaskStatus.IN_PROGRESS,
      },
      {
        id: TaskStatus.COMPLETED,
        label: "COMPLETED",
        filterFn: (task) => task.getStatus() === TaskStatus.COMPLETED,
      },
      {
        id: TaskStatus.ARCHIVED,
        label: "ARCHIVED",
        filterFn: (task) => task.getStatus() === TaskStatus.ARCHIVED,
      },
    ];

    this.dashboard = new GenericDashboardUI(tasks, {
      containerId: "dashBoardContainer",
      columns: taskColumns,
      cardRenderer: this.createTaskCard.bind(this),
      onCardClick: (task) => renderModalEditTask(task),
      itemId: (task) => task.getId(),
      itemGroupKey: (task) => task.getStatus(),
    });
  }

  render(): HTMLElement {
    return this.dashboard.render();
  }

  private createTaskCard(task: ITask): HTMLElement {
    const card = document.createElement("div");
    card.className = "task-card";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.getTitle();

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const userSpan = document.createElement("span");
    userSpan.className = "task-user";
    if (task.getUser()) {
      const names =
        task.getUser()!.getName().split(" ") ||
        task.getUser()!.getName().split("");
      userSpan.textContent = names[0];
    } else {
      userSpan.textContent = "";
    }
    meta.appendChild(userSpan);

    const status = document.createElement("span");
    status.className = "task-status";
    status.textContent = task.getStatus();
    meta.appendChild(status);

    card.appendChild(title);
    card.appendChild(meta);

    // Aplicar cor do border baseada no status
    const borderColor = getCardBorderColor(task.getStatus());
    setCardBorderColor(card, borderColor);

    return card;
  }
}
