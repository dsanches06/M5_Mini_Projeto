import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";
import { IUser } from "../../models/index.js";
import { renderModalEditTask } from "../modal/index.js";
import { getCardBorderColor, setCardBorderColor } from "../../helpers/index.js";

export class UsersDashboard {
  private container: HTMLElement;
  private tasks: ITask[] = [];
  private user: IUser;

  private readonly statusColumns = [
    { id: TaskStatus.CREATED, label: "CREATED" },
    { id: TaskStatus.ASSIGNED, label: "ASSIGNED" },
    { id: TaskStatus.BLOCKED, label: "BLOCKED" },
    { id: TaskStatus.IN_PROGRESS, label: "IN_PROGRESS" },
    { id: TaskStatus.COMPLETED, label: "COMPLETED" },
    { id: TaskStatus.ARCHIVED, label: "ARCHIVED" },
  ];

  constructor(user: IUser, tasks: ITask[] = []) {
    this.user = user;
    this.tasks = tasks;
    // Tenta reaproveitar o container existente ou cria um novo
    this.container = (document.querySelector("#dashBoardContainer") as HTMLElement) || 
                     document.createElement("div");
    this.container.id = "dashBoardContainer";
    this.container.classList.add("dash-board");
  }

  render(): HTMLElement {
    // 1. Cria a estrutura base das colunas (apenas uma vez)
    this.container.innerHTML = `
      <div class="dash-container">
        ${this.statusColumns.map(col => `
          <div class="dash-column">
            <div class="column-header">
              <h2>${col.label}</h2>
              <span class="column-count" data-status="${col.id}">0</span>
            </div>
            <div class="tasks-container" data-status="${col.id}"></div>
          </div>
        `).join('')}
      </div>
    `;

    this.populateColumns();
    this.attachEventListeners();
    return this.container;
  }

  private populateColumns(): void {
    // 2. Distribui as tasks pelas colunas existentes
    this.statusColumns.forEach(column => {
      const colTasks = this.tasks.filter(t => t.getStatus() === column.id);
      
      const tasksContainer = this.container.querySelector(`.tasks-container[data-status="${column.id}"]`) as HTMLElement;
      const countBadge = this.container.querySelector(`.column-count[data-status="${column.id}"]`) as HTMLElement;

      if (tasksContainer && countBadge) {
        countBadge.textContent = colTasks.length.toString();
        tasksContainer.innerHTML = ""; // Limpa apenas a lista interna da coluna
        
        colTasks.forEach(task => {
          tasksContainer.appendChild(this.createTaskCard(task));
        });
      }
    });
  }

  private createTaskCard(task: ITask): HTMLElement {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("data-task-id", task.getId().toString());

    const names = this.user.getName().split(" ");
    
    card.innerHTML = `
      <h3 class="task-title">${task.getTitle()}</h3>
      <div class="task-meta">
        <span class="task-user">${names[0]}</span>
        <span class="task-status">${task.getStatus()}</span>
      </div>
    `;

    setCardBorderColor(card, getCardBorderColor(task.getStatus()));
    return card;
  }

  private attachEventListeners(): void {
    // Delegação de eventos: um único listener no container pai
    this.container.onclick = (event: MouseEvent) => {
      const card = (event.target as HTMLElement).closest(".task-card");
      if (!card) return;

      const taskId = card.getAttribute("data-task-id");
      const task = this.tasks.find(t => t.getId().toString() === taskId);
      
      if (task) renderModalEditTask(task, this.user);
    };
  }

  updateTasks(newTasks: ITask[]): void {
    this.tasks = newTasks;
    this.populateColumns(); // Atualiza os cards sem recriar as colunas (melhor performance)
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}



