import { IProject, Project } from "../../projects/index.js";
import { addElementInContainer, clearContainer } from "../dom/index.js";
import { renderProjectDashboard } from "./index.js";
import { renderProjectModal } from "../modal/index.js";
import {
  ProjectPermissionService,
  ProjectService,
  UserService,
  TaskService,
  TimeLogService,
} from "../../services/index.js";
import { showConfirmDialog, showInfoBanner } from "../../helpers/index.js";
import { IUser } from "../../models/index.js";
import { ITask } from "../../tasks/index.js";

/* Renderiza os projetos em cards na Grid principal */
export async function renderProjectsCards(projects: IProject[]): Promise<void> {
  let gridContainer = document.querySelector(
    "#projectsGridContainer",
  ) as HTMLElement;

  if (!gridContainer) {
    gridContainer = document.createElement("div");
    gridContainer.id = "projectsGridContainer";
    gridContainer.className = "projects-grid-container";
    addElementInContainer("#containerSection", gridContainer);
  }

  gridContainer.innerHTML = "";

  for (const p of projects) {
    const card = await createProjectCard(p as Project);
    card.style.cursor = "pointer";

    card.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearContainer("#containerSection");
      const ganttElement = await renderProjectDashboard(p.getId());
      addElementInContainer("#containerSection", ganttElement);
    });

    gridContainer.appendChild(card);
  }
}

/* Cria a estrutura individual de cada card de projeto */
async function createProjectCard(project: Project): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "project-card";

  // HEADER (Título e Botões de Opções se existirem)
  const header = document.createElement("div");
  header.className = "card-header";
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";

  const title = document.createElement("h3");
  title.textContent = project.getName();

  const actionButtons = document.createElement("div");
  actionButtons.style.display = "flex";
  actionButtons.style.alignItems = "center";
  actionButtons.style.gap = "0.4rem";

  const editBtn = document.createElement("button");
  editBtn.className = "icon-button";
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.title = "Editar projeto";
  editBtn.setAttribute("aria-label", "Editar projeto");
  editBtn.style.backgroundColor = "#2196F3";
  editBtn.style.color = "white";
  editBtn.style.border = "none";
  editBtn.style.fontSize = "0.9rem";

  editBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    await renderProjectModal(project);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-button";
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.title = "Apagar projeto";
  deleteBtn.setAttribute("aria-label", "Apagar projeto");
  deleteBtn.style.backgroundColor = "#f44336";
  deleteBtn.style.color = "white";
  deleteBtn.style.border = "none";
  deleteBtn.style.fontSize = "0.9rem";

  deleteBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (!await showConfirmDialog(`Tem a certeza que deseja apagar o projeto "${project.getName()}"?`)) {
      return;
    }
    try {
      await ProjectService.deleteProject(project.getId());
      showInfoBanner(`Projeto "${project.getName()}" apagado com sucesso.`, "success-banner");
      card.remove();
    } catch (error) {
      showInfoBanner(`Erro ao apagar projeto: ${error}`, "error-banner");
    }
  });

  actionButtons.appendChild(editBtn);
  actionButtons.appendChild(deleteBtn);
  header.append(title, actionButtons);

  // STATUS (Badge)
  const status = document.createElement("span");
  status.className = `project-status status-${project.getStatus().toLowerCase()}`;
  status.textContent = project.getStatus();

  // DESCRIPTION
  const desc = document.createElement("p");
  desc.className = "project-desc";
  desc.textContent = project.getDescription() || "No description";

  // DATES (Container Flex)
  const datesContainer = document.createElement("div");
  datesContainer.className = "project-dates";

  const startDate = document.createElement("span");
  startDate.className = "start-date";
  startDate.textContent = `Início: ${new Date(project.getStartDate()).toLocaleDateString("pt-BR")}`;

  const endDate = document.createElement("span");
  endDate.className = "end-date";
  endDate.textContent = `Fim: ${new Date(project.getEndDateExpected()).toLocaleDateString("pt-BR")}`;

  datesContainer.appendChild(startDate);
  datesContainer.appendChild(endDate);

  const footer = document.createElement("div");
  footer.className = "project-card-footer";

  const avatarStack = document.createElement("div");
  avatarStack.className = "avatar-stack";

  let tasks: ITask[] = [];

  try {
    // Carregar tasks do projeto
    tasks = await TaskService.getTasksByProject(project.getId());

    // Extrair todos os user_ids únicos dos assignees
    const userIdsSet = new Set<number>();
    tasks.forEach((task: ITask) => {
      const assignees = task.getAssignees?.() || [];
      assignees.forEach((assignee: any) => {
        if (assignee.user_id) {
          userIdsSet.add(assignee.user_id);
        }
      });
    });

    // Carregar todos os users para pegar gender
    const allUsers = await UserService.getUsers();
    const userMap = new Map<number, IUser>();
    allUsers.forEach((user: IUser) => {
      userMap.set(user.getId(), user);
    });

    // Construir array de membros com gender
    const members: Array<{ userId: number; gender: string; user: IUser }> = [];
    userIdsSet.forEach((userId) => {
      const user = userMap.get(userId);
      if (user) {
        members.push({
          userId,
          gender: (user as any).getGender?.() || "Male",
          user,
        });
      }
    });

    // Renderizar avatares (máximo 4)
    const displayLimit = 4;
    members.slice(0, displayLimit).forEach((member, index) => {
      const img = document.createElement("img");
      img.className = "avatar-img";

      // Selecionar pasta baseado no gender
      const folder = member.gender === "Female" ? "woman" : "man";
      const randomValue = (index % 4) + 1; // 1-4
      img.src = `./src/assets/${folder}-${randomValue}.png`;
      img.alt = member.user.getName();
      img.title = member.user.getName();

      avatarStack.appendChild(img);
    });

    // Mostrar "+X" se houver mais membros
    if (members.length > displayLimit) {
      const more = document.createElement("span");
      more.className = "avatar-more";
      more.textContent = `+${members.length - displayLimit}`;
      avatarStack.appendChild(more);
    }
  } catch (error) {
    console.error("Erro ao carregar membros do projeto:", error);
  }

  footer.appendChild(avatarStack);

  // PROGRESS BAR
  const progressWrapper = document.createElement("div");
  progressWrapper.className = "project-progress-wrapper";

  const progressBar = document.createElement("div");
  progressBar.className = "project-progress-bar";

  // Calcular progresso baseado nas horas de time logs
  const progressValue = await calculateProgressFromTimeLogs(project, tasks);

  const progressFill = document.createElement("div");
  progressFill.className = "project-progress-fill";
  progressFill.style.width = `${progressValue}%`;

  progressBar.appendChild(progressFill);
  progressWrapper.appendChild(progressBar);

  // Adicionar ao card na ordem correta
  card.appendChild(header);
  card.appendChild(status);
  card.appendChild(desc);
  card.appendChild(datesContainer);
  card.appendChild(progressWrapper); // <-- Barra entra aqui
  card.appendChild(footer);

  return card;
}

/* Calcula o progresso do projeto baseado nas horas de time logs */
async function calculateProgressFromTimeLogs(
  project: Project,
  tasks: any[],
): Promise<number> {
  try {
    // Obter todos os time logs
    const allTimeLogs = await TimeLogService.getTimeLogs();

    // Filtrar time logs para as tasks do projeto
    const taskIds = tasks.map((t: any) => t.getId?.() || t.id);
    const projectTimeLogs = allTimeLogs.filter((log: any) =>
      taskIds.includes(log.task_id),
    );

    // Calcular total de horas registadas
    const totalHours = projectTimeLogs.reduce((sum: number, log: any) => {
      return sum + (log.hours || 0);
    }, 0);

    // Calcular total de horas estimadas das tasks
    const totalEstimatedHours = tasks.reduce((sum: number, task: any) => {
      const estimated = task.getEstimatedHours?.() || task.estimated_hours || 0;
      return sum + estimated;
    }, 0);

    // Calcular progress percentage
    if (totalEstimatedHours > 0) {
      const progress = Math.min((totalHours / totalEstimatedHours) * 100, 100);
      return Math.round(progress);
    }

    // Se não há horas estimadas, usar um limite padrão de 8 horas por task
    const defaultEstimatedHours = tasks.length * 8;
    if (defaultEstimatedHours > 0) {
      const progress = Math.min(
        (totalHours / defaultEstimatedHours) * 100,
        100,
      );
      return Math.round(progress);
    }

    return 0;
  } catch (error) {
    console.error("Erro ao calcular progresso do projeto:", error);
    return 0;
  }
}
