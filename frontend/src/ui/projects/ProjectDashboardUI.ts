import {
  ProjectService,
  TaskService,
  UserService,
  TeamService,
  TeamMemberService,
  SprintService,
} from "../../services/index.js";
import { ITask } from "../../tasks/index.js";
import { IUser } from "../../models/index.js";
import { showInfoBanner } from "../../helpers/infoBanner.js";
import {
  ActivityBar,
  formatDate,
  GanttTask,
  generateTeamColors,
  LegendItem,
  DEFAULT_COLORS,
} from "../../api/utils/index.js";
import { renderSprintModal } from "../modal/index.js";

// =======================
// INIT
// =======================
export async function renderProjectDashboard(id: number): Promise<HTMLElement> {
  const root = document.createElement("div") as HTMLDivElement;
  root.id = "dashboardProject";
  root.innerHTML = "";

  // Criar container principal com abas/seções
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "2rem";
  container.style.padding = "1rem";

  // Seção de Sprints
  const sprintsSection = await createSprintsSection(id);
  container.appendChild(sprintsSection);

  // Seção de Gantt Chart de Tarefas
  const gantt = await createGantt(id);
  container.appendChild(gantt);

  root.appendChild(container);
  return root;
}

// =======================
// SPRINTS SECTION
// =======================
async function createSprintsSection(projectId: number): Promise<HTMLElement> {
  const section = document.createElement("div");
  section.className = "sprints-section";
  section.style.borderTop = "2px solid #ccc";
  section.style.paddingTop = "1rem";

  try {
    // Carregar sprints do projeto
    const allSprints = await SprintService.getSprints();
    const projectSprints = allSprints.filter((s: any) => s.project_id === projectId);

    // Criar header com título e botão
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "1rem";

    const title = document.createElement("h3");
    title.textContent = `Sprints (${projectSprints.length})`;
    title.style.margin = "0";

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Novo Sprint";
    addBtn.style.padding = "0.5rem 1rem";
    addBtn.style.backgroundColor = "#4CAF50";
    addBtn.style.color = "white";
    addBtn.style.border = "none";
    addBtn.style.borderRadius = "4px";
    addBtn.style.cursor = "pointer";
    addBtn.style.fontSize = "0.9rem";

    addBtn.addEventListener("click", async () => {
      await renderSprintModal(projectId);
    });

    addBtn.addEventListener("mouseenter", () => {
      addBtn.style.backgroundColor = "#45a049";
    });

    addBtn.addEventListener("mouseleave", () => {
      addBtn.style.backgroundColor = "#4CAF50";
    });

    header.appendChild(title);
    header.appendChild(addBtn);

    section.appendChild(header);

    // Renderizar sprints em cards/lista
    if (projectSprints.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "Nenhum sprint criado ainda. Clique em '+ Novo Sprint' para começar.";
      emptyMsg.style.color = "#999";
      emptyMsg.style.fontStyle = "italic";
      section.appendChild(emptyMsg);
    } else {
      const sprintsList = document.createElement("div");
      sprintsList.style.display = "grid";
      sprintsList.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
      sprintsList.style.gap = "1rem";

      projectSprints.forEach((sprint: any) => {
        const sprintCard = createSprintCard(sprint, projectId);
        sprintsList.appendChild(sprintCard);
      });

      section.appendChild(sprintsList);
    }
  } catch (error) {
    console.error("Erro ao carregar sprints:", error);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Erro ao carregar sprints do projeto";
    errorMsg.style.color = "#e74c3c";
    section.appendChild(errorMsg);
  }

  return section;
}

// =======================
// SPRINT CARD
// =======================
function createSprintCard(sprint: any, projectId: number): HTMLElement {
  const card = document.createElement("div");
  card.style.backgroundColor = "#f9f9f9";
  card.style.border = "1px solid #ddd";
  card.style.borderRadius = "4px";
  card.style.padding = "1rem";
  card.style.cursor = "pointer";

  const name = document.createElement("h4");
  name.textContent = sprint.name;
  name.style.margin = "0 0 0.5rem 0";
  name.style.color = "#333";

  const description = document.createElement("p");
  description.textContent = sprint.description || "Sem descrição";
  description.style.margin = "0 0 0.75rem 0";
  description.style.color = "#666";
  description.style.fontSize = "0.9rem";

  const dates = document.createElement("p");
  const start = new Date(sprint.start_date).toLocaleDateString("pt-BR");
  const end = new Date(sprint.end_date).toLocaleDateString("pt-BR");
  dates.textContent = `${start} a ${end}`;
  dates.style.margin = "0";
  dates.style.fontSize = "0.85rem";
  dates.style.color = "#999";

  const status = document.createElement("span");
  status.textContent = sprint.status_id === 1 ? "Ativo" : "Inativo";
  status.style.display = "inline-block";
  status.style.marginTop = "0.75rem";
  status.style.padding = "0.25rem 0.75rem";
  status.style.backgroundColor = sprint.status_id === 1 ? "#4CAF50" : "#999";
  status.style.color = "white";
  status.style.borderRadius = "3px";
  status.style.fontSize = "0.8rem";

  // Botões de ação
  const actionButtons = document.createElement("div");
  actionButtons.style.display = "flex";
  actionButtons.style.gap = "0.5rem";
  actionButtons.style.marginTop = "1rem";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar";
  editBtn.style.padding = "0.4rem 0.8rem";
  editBtn.style.backgroundColor = "#2196F3";
  editBtn.style.color = "white";
  editBtn.style.border = "none";
  editBtn.style.borderRadius = "3px";
  editBtn.style.cursor = "pointer";
  editBtn.style.fontSize = "0.85rem";

  editBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderSprintModal(projectId, sprint);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Apagar";
  deleteBtn.style.padding = "0.4rem 0.8rem";
  deleteBtn.style.backgroundColor = "#f44336";
  deleteBtn.style.color = "white";
  deleteBtn.style.border = "none";
  deleteBtn.style.borderRadius = "3px";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontSize = "0.85rem";

  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (confirm(`Tem a certeza que deseja apagar o sprint "${sprint.name}"?`)) {
      try {
        await SprintService.deleteSprint(sprint.id);
        showInfoBanner(`Sprint "${sprint.name}" foi apagado com sucesso.`, "success-banner");
        // Recarregar a seção de sprints
        const dashboardElement = document.querySelector("#dashboardProject");
        if (dashboardElement) {
          const projectDashboard = await renderProjectDashboard(projectId);
          dashboardElement.replaceWith(projectDashboard);
        }
      } catch (error) {
        showInfoBanner(`Erro ao apagar sprint: ${error}`, "error-banner");
      }
    }
  });

  actionButtons.appendChild(editBtn);
  actionButtons.appendChild(deleteBtn);

  card.appendChild(name);
  card.appendChild(description);
  card.appendChild(dates);
  card.appendChild(status);
  card.appendChild(actionButtons);

  return card;
}

// =======================
// GANTT ROOT
// =======================
async function createGantt(projectId: number): Promise<HTMLElement> {
  const wrapper = document.createElement("div");
  wrapper.className = "gantt-wrapper";

  // Container para header e legend
  const topContainer = document.createElement("div");
  topContainer.className = "gantt-top";
  topContainer.appendChild(await createHeader(projectId));

  wrapper.appendChild(topContainer);
  wrapper.appendChild(createTimeline(6));

  try {
    // Carregar dados da API
    const tasks = await TaskService.getTasksByProject(projectId);
    const users = await UserService.getUsers();

    // Carregar teams e team_members com tratamento de erro
    let teams = [];
    let teamMembers = [];
    try {
      teams = await TeamService.getTeams();
      teamMembers = await TeamMemberService.getTeamMembers();
    } catch (dataError) {
      console.warn(`⚠️ Aviso ao carregar times e membros:`, dataError);
    }

    // Obter todos os user_ids dos assignees
    const assigneeUserIds = new Set<number>();
    tasks.forEach((task: ITask) => {
      const assignees = (task as any).getAssignees?.() || [];
      assignees.forEach((assignee: any) => {
        assigneeUserIds.add(assignee.user_id);
      });
    });

    // Filtrar teams que têm members nos assignees
    const filteredTeams = teams.filter((team: any) => {
      return teamMembers.some(
        (member: any) =>
          member.team_id === team.id && assigneeUserIds.has(member.user_id)
      );
    });

    // Gerar cores baseadas nos times filtrados
    const ganttColors = generateTeamColors(filteredTeams);

    // Adicionar legenda se houver times
    if (ganttColors.length > 0) {
      topContainer.appendChild(createLegend(ganttColors));
    }

    // Mapear usuários por ID
    const userMap = new Map<number, string>();
    users.forEach((user: IUser) => {
      userMap.set(user.getId(), user.getName());
    });

    // Transformar dados
    const ganttTasks = transformTasksToGantt(tasks, 6, userMap, ganttColors);

    // Renderizar tarefas
    wrapper.appendChild(createTasks(ganttTasks, 6));
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = `Erro ao carregar tarefas: ${error instanceof Error ? error.message : String(error)}`;
    errorMsg.style.color = "#e74c3c";
    errorMsg.style.padding = "20px";
    wrapper.appendChild(errorMsg);
  }

  return wrapper;
}

/**
 * Transforma tarefas do banco para formato GanttTask
 */
function transformTasksToGantt(
  tasks: ITask[],
  weeks: number,
  userMap: Map<number, string>,
  ganttColors: LegendItem[],
): GanttTask[] {
  // Usar cores dos times, ou as cores padrão se não houver times
  const colors =
    ganttColors.length > 0 ? ganttColors.map((c) => c.color) : DEFAULT_COLORS;

  return tasks.map((task, taskIndex) => {
    const assignees = (task as any).getAssignees?.() || [];

    const activities: ActivityBar[] =
      assignees.length > 0
        ? assignees.map((assignee: any, assigneeIndex: number) => ({
            label: `Activity ${assigneeIndex + 1}`,
            name: userMap.get(assignee.user_id) || `User ${assignee.user_id}`,
            start: assigneeIndex % weeks,
            duration: Math.min(2, weeks - (assigneeIndex % weeks)),
            color: colors[assigneeIndex % colors.length],
          }))
        : [
            {
              label: "Activity 1",
              name: "Unassigned",
              start: 0,
              duration: 1,
              color: colors[0],
            },
          ];

    return {
      name: `TASK ${taskIndex + 1}`,
      activities,
    };
  });
}

// =======================
// HEADER
// =======================
async function createHeader(projectId: number): Promise<HTMLElement> {
  const header = document.createElement("div");
  header.className = "gantt-header";

  try {
    const project = await ProjectService.getProjectById(projectId);

    if (project) {
      const name = project.getName() || "Sem Título";
      const startDate = formatDate(project.getStartDate());
      const endDate = formatDate(project.getEndDateExpected());

      header.innerHTML = `<h1>${name}</h1><p>De ${startDate} até ${endDate}</p>`;
    } else {
      header.innerHTML = `<h1>Projeto ${projectId} não encontrado</h1>`;
    }
  } catch (error) {
    console.error("Erro ao carregar o header:", error);
    header.innerHTML = `<h1>Erro ao carregar o projeto</h1>`;
    showInfoBanner("Erro ao carregar informações do projeto", "error");
  }

  return header;
}

// =======================
// LEGEND
// =======================
function createLegend(ganttColors: LegendItem[]): HTMLElement {
  const legend = document.createElement("div");
  legend.className = "legend";

  ganttColors.forEach((item) => {
    const row = document.createElement("div");
    row.className = "legend-item";
    row.innerHTML = `
      <span>${item.name}</span>
      <div style="background-color: ${item.color}; width: 50px; height: 4px;"></div>
    `;
    legend.appendChild(row);
  });

  return legend;
}

// =======================
// TIMELINE
// =======================
function createTimeline(weeks: number): HTMLElement {
  const timeline = document.createElement("div");
  timeline.className = "timeline";

  timeline.style.gridTemplateColumns = `repeat(${weeks}, 1fr)`;

  for (let i = 1; i <= weeks; i++) {
    const week = document.createElement("div");
    week.className = "week";
    week.textContent = `WEEK ${i}`;
    timeline.appendChild(week);
  }

  return timeline;
}

// =======================
// TASKS
// =======================
function createTasks(tasks: GanttTask[], weeks: number): HTMLElement {
  const container = document.createElement("div");

  tasks.forEach((task) => {
    container.appendChild(createTaskGroup(task, weeks));
  });

  return container;
}

// =======================
// TASK GROUP
// =======================
function createTaskGroup(task: GanttTask, weeks: number): HTMLElement {
  const group = document.createElement("div");

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.name;

  group.appendChild(title);

  task.activities.forEach((act) => {
    group.appendChild(createActivity(act, weeks));
  });

  return group;
}

// =======================
// ACTIVITY
// =======================
function createActivity(act: ActivityBar, weeks: number): HTMLElement {
  const row = document.createElement("div");
  row.className = "activity-row";

  const label = document.createElement("div");
  label.className = "activity-label";
  label.textContent = act.label; // Ex: "Activity 1"

  const barContainer = document.createElement("div");
  barContainer.className = "bar-container";

  const bar = document.createElement("div");
  bar.className = "bar";

  // IMPORTANTE: O start + 1 define em que semana começa
  // O span define quantas semanas dura
  bar.style.gridColumn = `${act.start + 1} / span ${act.duration}`;
  bar.style.backgroundColor = act.color;
  bar.textContent = act.name; // Ex: "Membro da Equipa"

  barContainer.appendChild(bar);
  row.appendChild(label);
  row.appendChild(barContainer);

  return row;
}
