import { TaskService } from "../../services/index.js";
import { showTasksCounters, TaskDashboardUI } from "./index.js";
import {
  addElementInContainer,
  createSection,
  createHeadingTitle,
  createStatisticsCounter,
  clearContainer,
} from "../dom/index.js";

/* Lista de tarefas obtidas da API */
export async function loadTasksPage(): Promise<void> {
  clearContainer("#containerSection");

  const title = "VISÃO GERAL DE TAREFAS";
  addElementInContainer("#containerSection", createHeadingTitle("h2", title));

  const taskCounterSection = createTaskCounter("taskCounters") as HTMLElement;
  addElementInContainer("#containerSection", taskCounterSection);

  // Carregar tarefas da API
  const tasks = await TaskService.getTasks();

  // Mostrar contadores com as tarefas
  await showTasksCounters("tarefas", tasks);

  // Renderizar dashboard com as tarefas
  const taskDashboard = new TaskDashboardUI();
  addElementInContainer(
    "#containerSection",
    await taskDashboard.loadAndRender(),
  );
}
/* */
function createTaskCounter(id: string): HTMLElement {
  //
  const allTasksBtn = createStatisticsCounter(
    "allTaskSection",
    "allTasksBtn",
    "./src/assets/tarefa.png",
    "tarefas",
    "allTasksCounter",
  ) as HTMLElement;

  //
  const pendingTaskBtn = createStatisticsCounter(
    "pendingTaskSection",
    "pendingTaskBtn",
    "./src/assets/pendente.png",
    "pendentes",
    "pendingTasksCounter",
  ) as HTMLElement;
  //
  const completedTaskBtn = createStatisticsCounter(
    "completedTaskSection",
    "completedTaskBtn",
    "./src/assets/tarefa-concluida.png",
    "concluídos",
    "completedTaskCounter",
  ) as HTMLElement;

  //
  const sectionTasksCounter = createSection(`${id}`) as HTMLElement;
  sectionTasksCounter.classList.add("tasks-counters");
  sectionTasksCounter.append(allTasksBtn, pendingTaskBtn, completedTaskBtn);
  return sectionTasksCounter;
}
