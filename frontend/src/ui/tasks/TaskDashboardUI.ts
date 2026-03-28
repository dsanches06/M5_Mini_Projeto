import { ITask } from "../../tasks/index.js";
import { IProject } from "../../projects/index.js";
import { IUser } from "../../models/index.js";
import { loadTaskDetailPage } from "./TaskDetailPageUI.js";
import { createTaskCard } from "./TaskCardUI.js";
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
      await this.render();
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
  private async render(): Promise<void> {
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
    for (const project of this.projects) {
      const tasks = this.tasksByProject.get(project.getId()) || [];
      const projectSection = await this.createProjectSection(project, tasks);
      this.container.appendChild(projectSection);
    }
  }

  /**
   * Cria uma seção de projeto com suas tarefas
   */
  private async createProjectSection(project: IProject, tasks: ITask[]): Promise<HTMLElement> {
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
      for (const task of tasks) {
        const taskCard = await createTaskCard(task, this.userMap);
        tasksWrapper.appendChild(taskCard);
      }
    }

    section.appendChild(header);
    section.appendChild(tasksWrapper);

    return section;
  }
}
