import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";
import { IUser } from "../../models/index.js";
import { TaskService, TaskStatusService, SprintTaskService, SprintService } from "../../services/index.js";
import { loadUserTasksPage } from "../users/index.js";
import { getCardBorderColor, setCardBorderColor, showInfoBanner } from "../../helpers/index.js";
import { activateMenu } from "../dom/index.js";
import { styleTransparentButton } from "../dom/buttonStyles.js";

export class UsersDashboard {
  private container: HTMLElement;
  private tasks: ITask[] = [];
  private user: IUser;
  private statusMap: { [key: string]: number } = {};

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
    const dashboardElement = document.createElement("div");
    this.loadStatusMap();
  }

  private async loadStatusMap(): Promise<void> {
    try {
      const statuses = await TaskStatusService.getTaskStatuses();
      statuses.forEach(status => {
        this.statusMap[status.name] = status.id;
      });
    } catch (error) {
      console.error("Erro ao carregar mapa de status:", error);
      showInfoBanner("Erro ao carregar status de tarefas", "error-banner");


      this.statusMap = {
        "CREATED": 1,
        "ASSIGNED": 2,
        "BLOCKED": 3,
        "IN_PROGRESS": 4,
        "COMPLETED": 5,
        "ARCHIVED": 6,
      };
    }
  }

  render(): HTMLElement {
    // 1. Cria a estrutura base das colunas (apenas uma vez)
    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Voltar`;
    backBtn.addEventListener("click", async () => {
      try {
        activateMenu("#menuUsers");
        await loadUserTasksPage(this.user.getId());
      } catch (error) {
        console.error("Erro ao voltar para página de tarefas:", error);
        showInfoBanner("Erro ao voltar para página de tarefas", "error-banner");
      }
    });

    const mainContainer = document.createElement("div");
    mainContainer.style.width = "100%";
    mainContainer.style.display = "flex";
    mainContainer.style.flexDirection = "column";

    const dashContainer = document.createElement("div");
    dashContainer.className = "dash-container";
    dashContainer.style.display = "flex";
    dashContainer.style.flexWrap = "wrap";
    dashContainer.style.justifyContent = "center";
    dashContainer.style.gap = "12px";
    dashContainer.style.width = "100%";

    this.statusColumns.forEach(col => {
      const column = document.createElement("div");
      column.className = "dash-column";
      column
      column
      column
      column
      column
      column
      column

      const columnHeader = document.createElement("div");
      columnHeader.className = "column-header";
      columnHeader
      columnHeader
      columnHeader
      columnHeader
      columnHeader
      columnHeader

      const title = document.createElement("h2");
      title.textContent = col.label;
      title
      title
      title
      title

      const count = document.createElement("span");
      count.className = "column-count";
      count.setAttribute("data-status", col.id.toString());
      count.textContent = "0";
      count
      count
      count
      count
      count
      count
      count
      count
      count
      count

      columnHeader.appendChild(title);
      columnHeader.appendChild(count);

      const tasksContainer = document.createElement("div");
      tasksContainer.className = "tasks-container";
      tasksContainer.setAttribute("data-status", col.id.toString());
      tasksContainer
      tasksContainer
      tasksContainer
      tasksContainer
      tasksContainer

      column.appendChild(columnHeader);
      column.appendChild(tasksContainer);
      dashContainer.appendChild(column);
    });

    mainContainer.appendChild(dashContainer);
    this.container.innerHTML = "";
    if (this.container.firstChild) {
      this.container.insertBefore(backBtn, this.container.firstChild);
    } else {
      this.container.appendChild(backBtn);
    }
    this.container.appendChild(mainContainer);
    
    this.attachEventListeners();
    return this.container;
  }

  async initializeDashboard(): Promise<void> {
    await this.populateColumns();
  }

  private async populateColumns(): Promise<void> {
    // 2. Distribui as tasks pelas colunas existentes
    for (const column of this.statusColumns) {
      const colTasks = this.tasks.filter(t => t.getStatus() === column.id);
      
      const tasksContainer = this.container.querySelector(`.tasks-container[data-status="${column.id}"]`) as HTMLElement;
      const countBadge = this.container.querySelector(`.column-count[data-status="${column.id}"]`) as HTMLElement;

      if (tasksContainer && countBadge) {
        countBadge.textContent = colTasks.length.toString();
        tasksContainer.innerHTML = ""; // Limpa apenas a lista interna da coluna
        
        for (const task of colTasks) {
          const card = await this.createTaskCard(task);
          tasksContainer.appendChild(card);
        }
      }
    }
  }

  private async createTaskCard(task: ITask): Promise<HTMLElement> {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("data-task-id", task.getId().toString());
    card
    card
    card
    card
    card
    card
    card
    card.addEventListener("mouseover", () => {
      card
      card
    });
    card.addEventListener("mouseout", () => {
      card
      card
    });

    const names = this.user.getName().split(" ");
    
    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.getTitle();
    title
    title
    title
    title

    // Buscar sprint associado
    let sprintName = "Sem Sprint";
    try {
      const sprintTasks = await SprintTaskService.getSprintTasks();
      const sprintTask = sprintTasks.find(
        (st: any) => st.task_id === task.getId()
      );
      
      if (sprintTask && sprintTask.sprint_id) {
        const allSprints = await SprintService.getSprints();
        const sprint: any = allSprints.find(
          (s: any) => (s.getId?.() ?? s.id) === sprintTask.sprint_id
        );
        if (sprint) {
          sprintName = (sprint.getName?.() ?? sprint.name ?? "Sprint") as string;
        }
      }
    } catch (error) {
      console.warn("Erro ao buscar sprint:", error);
    }

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta
    meta
    meta
    meta

    const sprintSpan = document.createElement("span");
    sprintSpan.className = "task-sprint";
    sprintSpan.textContent = sprintName;
    sprintSpan
    sprintSpan
    sprintSpan
    sprintSpan
    sprintSpan
    sprintSpan
    sprintSpan
    sprintSpan

    const userSpan = document.createElement("span");
    userSpan.className = "task-user";
    userSpan.textContent = names[0];
    userSpan
    userSpan
    userSpan
    userSpan
    userSpan

    const statusSpan = document.createElement("span");
    statusSpan.className = "task-status";
    statusSpan.textContent = task.getStatus();
    statusSpan
    statusSpan
    statusSpan
    statusSpan
    statusSpan
    statusSpan

    meta.appendChild(sprintSpan);
    meta.appendChild(userSpan);
    meta.appendChild(statusSpan);

    card.appendChild(title);
    card.appendChild(meta);

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
      
      if (task) this.renderStatusModal(task);
    };
  }

  private renderStatusModal(task: ITask): void {
    const modal = document.createElement("section");
    modal.className = "modal";
    modal
    modal.id = `statusModal-${task.getId()}`;

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent
    modalContent
    modalContent
    modalContent
    modalContent
    modalContent

    const title = document.createElement("h2");
    title.textContent = `Alterar Estado - ${task.getTitle()}`;
    title
    title
    title

    const statusList = document.createElement("div");
    statusList
    statusList
    statusList
    statusList

    this.statusColumns.forEach(statusCol => {
      const btn = document.createElement("button");
      btn.className = "btn status-option-btn";
      
      const isSelected = task.getStatus() === statusCol.id;
      
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      btn
      
      btn.innerHTML = `
        <span>
          ${isSelected ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-circle"></i>'}
        </span>
        <span>${statusCol.label}</span>
      `;
      btn.title = `Mover para ${statusCol.label}`;
      
      btn.addEventListener("mouseover", () => {
        if (!isSelected) {
          btn
          btn
          btn
        }
      });
      
      btn.addEventListener("mouseout", () => {
        if (!isSelected) {
          btn
          btn
          btn
        }
      });
      
      btn.addEventListener("click", async () => {
        await this.updateTaskStatus(task.getId(), statusCol.id);
        modal.remove();
      });
      
      statusList.appendChild(btn);
    });

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn secondary";
    closeBtn
    closeBtn
    styleTransparentButton(closeBtn, "#999", "#333");
    closeBtn.innerHTML = `<i class="fas fa-times"></i> Fechar`;
    closeBtn.addEventListener("click", () => modal.remove());

    modalContent.append(title, statusList, closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  private async updateTaskStatus(taskId: number, newStatus: string): Promise<void> {
    try {
      const task = this.tasks.find(t => t.getId() === taskId);
      if (!task) return;

      // Atualizar o status da tarefa
      await TaskService.updateTask(taskId, { status_id: this.getStatusId(newStatus) });
      
      // Aguardar um pouco para garantir que o backend processou a mudança
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Atualizar a tarefa localmente
      (task as any).setStatus(newStatus);
      
      // Recarregar a página
      await this.populateColumns();
      showInfoBanner(`Tarefa movida para ${newStatus}`, "success-banner");
    } catch (error) {
      console.error("Erro ao atualizar estado da tarefa:", error);
      showInfoBanner("Erro ao atualizar estado da tarefa", "error-banner");
    }
  }

  private getStatusId(statusLabel: string): number {
    return this.statusMap[statusLabel] || 1;
  }

  async updateTasks(newTasks: ITask[]): Promise<void> {
    this.tasks = newTasks;
    await this.populateColumns(); // Atualiza os cards sem recriar as colunas (melhor performance)
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}



