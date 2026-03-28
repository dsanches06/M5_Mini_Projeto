import {
  ProjectService,
  TaskService,
  SprintService,
} from "../../services/index.js";
import { showConfirmDialog, showInfoBanner } from "../../helpers/index.js";
import { renderSprintModal, renderTaskModal } from "../modal/index.js";
import { createHeadingTitle } from "../dom/index.js";
import { renderSprintsCards } from "../sprints/index.js";
import { renderTaskCards } from "../tasks/index.js";
import { renderProjectGantt } from "./index.js";

// =======================
// INIT
// =======================
export async function renderProjectDashboard(id: number): Promise<HTMLElement> {
  const root = document.createElement("div") as HTMLDivElement;
  root.id = "dashboardProject";
  root.innerHTML = "";

  const project = await ProjectService.getProjectById(id);
  const projectName = project?.getName() || "Projeto";

  // Criar container principal com abas/seções
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "2rem";
  container.style.padding = "1rem";

  // Cabeçalho do dashboard
  container.appendChild(
    createHeadingTitle("h2", `DASHBOARD DO PROJETO: ${projectName}`),
  );

  // Conteúdo principal em duas colunas: sprints e tarefas
  const dashboardContent = document.createElement("div");
  dashboardContent.className = "project-dashboard-content";
  dashboardContent.appendChild(await createSprintsSection(id));
  dashboardContent.appendChild(await createTasksSection(id));
  container.appendChild(dashboardContent);

  const gantt = await renderProjectGantt(id);
  container.appendChild(gantt);

  root.appendChild(container);
  return root;
}

// =======================
// SPRINTS SECTION
// =======================
async function createSprintsSection(projectId: number): Promise<HTMLElement> {
  const section = document.createElement("div");
  section.className = "project-dashboard-section sprints-section";

  try {
    // Carregar sprints do projeto
    const allSprints = await SprintService.getSprints();
    const projectSprints = allSprints.filter(
      (s: any) => s.project_id === projectId,
    );

    // Criar header com título e botão
    const header = document.createElement("div");
    header.className = "project-section-header";

    const titleWrapper = document.createElement("div");
    titleWrapper.className = "section-title-wrapper";

    const title = document.createElement("h3");
    title.textContent = `Sprints (${projectSprints.length})`;

    const toggleIcon = document.createElement("span");
    toggleIcon.className = "section-dropdown-icon";
    toggleIcon.textContent = "▼";

    titleWrapper.appendChild(toggleIcon);
    titleWrapper.appendChild(title);

    const addBtn = document.createElement("button");
    addBtn.className = "btn primary";
    addBtn.textContent = "+ Novo Sprint";
    addBtn.addEventListener("click", async () => {
      await renderSprintModal(projectId);
    });

    header.appendChild(titleWrapper);
    header.appendChild(addBtn);

    section.appendChild(header);

    const cardsContainer = document.createElement("div");
    cardsContainer.id = "projectSprintsContainer";
    cardsContainer.className = "project-section-cards";

    let isOpen = true;
    titleWrapper.addEventListener("click", () => {
      isOpen = !isOpen;
      cardsContainer.classList.toggle("collapsed", !isOpen);
      toggleIcon.style.transform = isOpen ? "rotate(0deg)" : "rotate(-90deg)";
    });

    section.appendChild(cardsContainer);

    // Renderizar sprints em cards/lista
    if (projectSprints.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.className = "empty-message";
      emptyMsg.textContent =
        "Nenhum sprint criado ainda. Clique em '+ Novo Sprint' para começar.";
      section.appendChild(emptyMsg);
    } else {
      await renderSprintsCards(projectSprints, cardsContainer);
    }
  } catch (error) {
    console.error("Erro ao carregar sprints:", error);
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.textContent = "Erro ao carregar sprints do projeto";
    section.appendChild(errorMsg);
  }

  return section;
}

// =======================
// TASKS SECTION
// =======================
async function createTasksSection(projectId: number): Promise<HTMLElement> {
  const section = document.createElement("div");
  section.className = "project-dashboard-section tasks-section";

  try {
    const tasks = await TaskService.getTasksByProject(projectId);

    const header = document.createElement("div");
    header.className = "project-section-header";

    const titleWrapper = document.createElement("div");
    titleWrapper.className = "section-title-wrapper";

    const title = document.createElement("h3");
    title.textContent = `Tarefas (${tasks.length})`;

    const toggleIcon = document.createElement("span");
    toggleIcon.className = "section-dropdown-icon";
    toggleIcon.textContent = "▼";

    titleWrapper.appendChild(toggleIcon);
    titleWrapper.appendChild(title);

    const addBtn = document.createElement("button");
    addBtn.className = "btn primary";
    addBtn.textContent = "+ Nova Tarefa";
    addBtn.addEventListener("click", async () => {
      await renderTaskModal(projectId, undefined, undefined, async () => {
        const dashboardElement = document.querySelector("#dashboardProject");
        if (dashboardElement) {
          const projectDashboard = await renderProjectDashboard(projectId);
          dashboardElement.replaceWith(projectDashboard);
        }
      });
    });

    header.appendChild(titleWrapper);
    header.appendChild(addBtn);
    section.appendChild(header);

    const tasksContent = document.createElement("div");
    tasksContent.className = "project-section-cards";

    let isOpen = true;
    titleWrapper.addEventListener("click", () => {
      isOpen = !isOpen;
      tasksContent.classList.toggle("collapsed", !isOpen);
      toggleIcon.style.transform = isOpen ? "rotate(0deg)" : "rotate(-90deg)";
    });

    if (tasks.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.className = "empty-message";
      emptyMsg.textContent =
        "Nenhuma tarefa criada ainda. Clique em '+ Nova Tarefa' para começar.";
      tasksContent.appendChild(emptyMsg);
    } else {
      const tasksList = document.createElement("div");
      tasksList.className = "project-tasks-grid";
      await renderTaskCards(tasksList, tasks);
      tasksContent.appendChild(tasksList);
    }

    section.appendChild(tasksContent);
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.textContent = "Erro ao carregar tarefas do projeto";
    section.appendChild(errorMsg);
  }

  return section;
}
