import {
  ProjectService,
  TaskService,
  UserService,
} from "../../services/index.js";
import { ITask } from "../../tasks/index.js";
import { IUser } from "../../models/index.js";
import { showInfoBanner } from "../../helpers/infoBanner.js";
import { Project } from "../../projects/index.js";

interface LegendItem {
  name: string;
  color: string;
}

interface ActivityBar {
  label: string;
  name: string;
  start: number;
  duration: number;
  color: string;
}

interface GanttTask {
  name: string;
  activities: ActivityBar[];
}

// =======================
// CORES
// =======================
const GANTT_COLORS: LegendItem[] = [
  { name: "Engineering", color: "#e6a38a" },
  { name: "Research", color: "#d97b7b" },
  { name: "Product", color: "#9b6c7a" },
  { name: "Marketing", color: "#5c5366" },
  { name: "Copywriting", color: "#6d8199" },
  { name: "Business", color: "#4f6a7a" },
];

// =======================
// INIT
// =======================
export async function renderProjectDashboard(id: number): Promise<HTMLElement> {
  const root = document.createElement("div") as HTMLDivElement;
  root.id = "dashboardProject";
  root.innerHTML = "";

  const gantt = await createGantt(id);
  root.appendChild(gantt);

  return root;
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
  topContainer.appendChild(createLegend());

  wrapper.appendChild(topContainer);
  wrapper.appendChild(createTimeline(6));

  try {
    // Carregar dados da API
    const tasks = await TaskService.getTasksByProject(projectId);
    const users = await UserService.getUsers();

    // Mapear usuários por ID
    const userMap = new Map<number, string>();
    users.forEach((user: IUser) => {
      userMap.set(user.getId(), user.getName());
    });

    // Transformar dados
    const ganttTasks = transformTasksToGantt(tasks, 6, userMap);

    // Renderizar tarefas
    wrapper.appendChild(createTasks(ganttTasks, 6));
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Erro ao carregar tarefas";
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
): GanttTask[] {
  return tasks.map((task, taskIndex) => {
    const assignees = (task as any).getAssignees?.() || [];

    const activities: ActivityBar[] =
      assignees.length > 0
        ? assignees.map((assignee: any, assigneeIndex: number) => ({
            label: `Activity ${assigneeIndex + 1}`,
            name: userMap.get(assignee.user_id) || `User ${assignee.user_id}`,
            start: assigneeIndex % weeks,
            duration: Math.min(2, weeks - (assigneeIndex % weeks)),
            color: GANTT_COLORS[assigneeIndex % GANTT_COLORS.length].color,
          }))
        : [
            {
              label: "Activity 1",
              name: "Unassigned",
              start: 0,
              duration: 1,
              color: GANTT_COLORS[0].color,
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
    const project: Project | null =
      await ProjectService.getProjectById(projectId);

    // Verifica se o projeto existe antes de tentar ler as propriedades
    if (project) {
      // Se a tua API devolve "name" e "start_date" (ajusta os nomes se forem diferentes)
      const name = project.getName() || "Sem Título";
      const startDate = project.getStartDate() || "Data não definida";

      header.innerHTML = `
        <h1>${name}</h1>
        <p>${startDate}</p>
      `;
    } else {
      header.innerHTML = `<h1>Projeto ${projectId} não encontrado</h1>`;
    }
  } catch (error) {
    console.error("Erro ao carregar o header:", error);
    header.innerHTML = "";
    showInfoBanner("Erro ao carregar informações do projeto", "error");
  }

  return header;
}

// =======================
// LEGEND
// =======================
function createLegend(): HTMLElement {
  const legend = document.createElement("div");
  legend.className = "legend";

  GANTT_COLORS.forEach((item) => {
    const row = document.createElement("div");
    row.className = "legend-item";

    row.innerHTML = `
      <span>${item.name}</span>
      <div style="background:${item.color}"></div>
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
