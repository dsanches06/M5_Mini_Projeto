import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";
import { createSection } from "../dom/CreatePage.js";
import { IUser } from "../../models/index.js";
import { renderModalEditTask } from "../modal/index.js";
import { getCardBorderColor, setCardBorderColor } from "../../helpers/index.js";

export class TaskDashboardUI {
  private container: HTMLElement;
  private user?: IUser;
  private tasks: ITask[];

  constructor(tasks: ITask[], user?: IUser) {
    this.tasks = tasks;
    this.user = user;
    const existing = document.querySelector(
      "#dashBoardContainer",
    ) as HTMLElement | null;
    this.container = existing || createSection("dashBoardContainer");
  }

  render(): HTMLElement {
    this.container.innerHTML = "";
    this.container.classList.add("dash-board");

    const boardHTML = `
      <div class="dash-container">
        <div class="dash-column">
          <div class="column-header">
            <h2>CREATED</h2>
            <span class="column-count" data-status="CREATED">0</span>
          </div>
          <div class="tasks-container" data-status="CREATED"></div>
        </div>

        <div class="dash-column">
          <div class="column-header">
            <h2>ASSIGNED</h2>
            <span class="column-count" data-status="ASSIGNED">0</span>
          </div>
          <div class="tasks-container" data-status="ASSIGNED"></div>
        </div>

        <div class="dash-column">
          <div class="column-header">
            <h2>BLOCKED</h2>
            <span class="column-count" data-status="BLOCKED">0</span>
          </div>
          <div class="tasks-container" data-status="BLOCKED"></div>
        </div>

        <div class="dash-column">
          <div class="column-header">
            <h2>IN_PROGRESS</h2>
            <span class="column-count" data-status="IN_PROGRESS">0</span>
          </div>
          <div class="tasks-container" data-status="IN_PROGRESS"></div>
        </div>

        <div class="dash-column">
          <div class="column-header">
            <h2>COMPLETED</h2>
            <span class="column-count" data-status="COMPLETED">0</span>
          </div>
          <div class="tasks-container" data-status="COMPLETED"></div>
        </div>

           <div class="dash-column">
          <div class="column-header">
            <h2>ARCHIVED</h2>
            <span class="column-count" data-status="ARCHIVED">0</span>
          </div>
          <div class="tasks-container" data-status="ARCHIVED"></div>
        </div>
      </div>
    `;

    this.container.innerHTML = boardHTML;
    this.populateTasks();

    return this.container;
  }

  private populateTasks(): void {
    const allTasks = this.user ? this.user.getTasks() : this.tasks;

    // Agrupar tarefas por status
    const tasksByStatus: Map<TaskStatus, ITask[]> = new Map();

    const statuses: TaskStatus[] = Object.keys(TaskStatus).map(
      (key) => (TaskStatus as any)[key],
    );
    statuses.forEach((status: TaskStatus) => {
      tasksByStatus.set(status, []);
    });

    allTasks.forEach((task) => {
      const status = task.getStatus();
      const tasksForStatus = tasksByStatus.get(status) || [];
      tasksForStatus.push(task);
      tasksByStatus.set(status, tasksForStatus);
    });

    // Preencher cada coluna
    const statusesOrder: TaskStatus[] = [
      TaskStatus.CREATED,
      TaskStatus.ASSIGNED,
      TaskStatus.BLOCKED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
      TaskStatus.ARCHIVED,
    ];

    statusesOrder.forEach((status: TaskStatus) => {
      const tasks = tasksByStatus.get(status) || [];
      const container = this.container.querySelector(
        `.tasks-container[data-status="${status}"]`,
      ) as HTMLElement | null;
      const countBadge = this.container.querySelector(
        `.column-count[data-status="${status}"]`,
      ) as HTMLElement | null;

      if (!container) return;

      if (countBadge) {
        countBadge.textContent = tasks.length.toString();
      }

      container.innerHTML = "";
      tasks.forEach((task) => {
        const taskCard = this.createTaskCard(task);
        container.appendChild(taskCard);
      });
    });
  }

  private createTaskCard(task: ITask): HTMLElement {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("data-task-id", task.getId().toString());

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.getTitle();

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const userSpan = document.createElement("span");
    userSpan.className = "task-user";
    meta.appendChild(userSpan);
    if (this.user) {
      const names =
        this.user.getName().split(" ") || this.user.getName().split("");
      userSpan.textContent = names[0];
    } else {
      userSpan.textContent = "";
    }

    const status = document.createElement("span");
    status.className = "task-status";
    status.textContent = task.getStatus();
    meta.appendChild(status);

    card.appendChild(title);
    card.appendChild(meta);

    // Aplicar cor do border baseada no status
    const borderColor = getCardBorderColor(task.getStatus());
    setCardBorderColor(card, borderColor);

    card.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this.user) {
        renderModalEditTask(task, this.user);
      } else {
        renderModalEditTask(task);
      }
    });

    return card;
  }
}
