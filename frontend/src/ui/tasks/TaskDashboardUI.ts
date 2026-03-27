import { ITask } from "../../tasks/index.js";
import { IProject } from "../../projects/index.js";
import { IUser } from "../../models/index.js";
import { getCardBorderColor, setCardBorderColor } from "../../helpers/index.js";
import { renderModalEditTask } from "../modal/index.js";
import { ProjectService, TaskService, UserService } from "../../services/index.js";

export class TaskDashboardUI {
  private container: HTMLElement;
  private projects: IProject[] = [];
  private tasksByProject: Map<number, ITask[]> = new Map();
  private userMap: Map<number, IUser> = new Map();

  constructor() {
    this.container = document.createElement("div");
    this.container.id = "taskDashboardContainer";
    this.container.className = "task-dashboard-container";
  }

  /**
   * Carrega dados da API e renderiza
   */
  public async loadAndRender(): Promise<HTMLElement> {
    try {
      await this.loadProjectsAndTasks();
      this.render();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      this.container.innerHTML = `
        <div class="empty-state">
          <p>Erro ao carregar tarefas</p>
        </div>
      `;
    }
    return this.container;
  }

  /**
   * Carrega projetos e tarefas da API
   */
  private async loadProjectsAndTasks(): Promise<void> {
    try {
      // Carregar todos os usuários uma única vez
      const allUsers = await UserService.getUsers();
      this.userMap.clear();
      allUsers.forEach((user: IUser) => {
        this.userMap.set(user.getId(), user);
      });

      // Buscar todos os projetos
      const projectsData = await ProjectService.getProjects();
      this.projects = projectsData;

      // Para cada projeto, buscar suas tarefas
      for (const project of this.projects) {
        try {
          const tasks = await TaskService.getTasksByProject(project.getId());
          this.tasksByProject.set(project.getId(), tasks);
        } catch (error) {
          console.warn(`Erro ao buscar tarefas do projeto ${project.getId()}:`, error);
          this.tasksByProject.set(project.getId(), []);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      this.projects = [];
    }
  }

  /**
   * Renderiza as tarefas em um container com cards agrupadas por projeto
   */
  private render(): void {
    this.container.innerHTML = "";
    
    if (this.projects.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>Nenhum projeto encontrado</p>
        </div>
      `;
      return;
    }

    // Renderizar cada projeto com suas tarefas
    this.projects.forEach(project => {
      const tasks = this.tasksByProject.get(project.getId()) || [];
      const projectSection = this.createProjectSection(project, tasks);
      this.container.appendChild(projectSection);
    });

    this.attachEventListeners();
  }

  /**
   * Cria uma seção de projeto com suas tarefas
   */
  private createProjectSection(project: IProject, tasks: ITask[]): HTMLElement {
    const section = document.createElement("div");
    section.className = "project-task-section";

    // Cabeçalho do projeto
    const header = document.createElement("div");
    header.className = "project-task-header";
    header.innerHTML = `<h2>${project.getName()}</h2><div class="project-separator"></div>`;

    // Wrapper dos cards
    const tasksWrapper = document.createElement("div");
    tasksWrapper.className = "tasks-cards-wrapper";

    if (tasks.length === 0) {
      tasksWrapper.innerHTML = `
        <div class="empty-project-state">
          <p>Nenhuma tarefa neste projeto</p>
        </div>
      `;
    } else {
      // Renderizar cards das tarefas
      tasks.forEach(task => {
        const taskCard = this.createTaskCard(task);
        tasksWrapper.appendChild(taskCard);
      });
    }

    section.appendChild(header);
    section.appendChild(tasksWrapper);

    return section;
  }

  /**
   * Cria um card individual para uma tarefa
   */
  private createTaskCard(task: ITask): HTMLElement {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("data-task-id", task.getId().toString());

    // Obter assignee da tarefa (objetos com user_id)
    const assignees = task.getAssignees?.() || [];
    let assigneeName = "Sem atribuição";
    
    if (assignees.length > 0) {
      const firstAssignee = assignees[0];
      // Obter nome do usuário usando o mapa
      const user = this.userMap.get(firstAssignee.user_id);
      if (user) {
        assigneeName = user.getName().split(" ")[0];
      }
    }
    
    card.innerHTML = `
      <h3 class="task-title">${task.getTitle()}</h3>
      <div class="task-meta">
        <span class="task-user">${assigneeName}</span>
        <span class="task-status">${task.getStatus()}</span>
      </div>
    `;

    setCardBorderColor(card, getCardBorderColor(task.getStatus()));
    return card;
  }

  /**
   * Adicionar event listeners aos cards
   */
  private attachEventListeners(): void {
    this.container.addEventListener("click", (event: MouseEvent) => {
      const card = (event.target as HTMLElement).closest(".task-card");
      if (!card) return;

      const taskId = card.getAttribute("data-task-id");
      
      // Procurar a tarefa em todos os projetos
      let foundTask: ITask | undefined;
      for (const tasks of this.tasksByProject.values()) {
        foundTask = tasks.find(t => t.getId().toString() === taskId);
        if (foundTask) break;
      }

      if (foundTask) {
        // Obter o primeiro assignee
        const assignees = foundTask.getAssignees?.() || [];
        if (assignees.length > 0) {
          const assigneeUser = this.userMap.get(assignees[0].user_id);
          // Abre o modal de edição da tarefa
          if (assigneeUser) {
            renderModalEditTask(foundTask, assigneeUser);
          }
        }
      }
    });
  }
}
