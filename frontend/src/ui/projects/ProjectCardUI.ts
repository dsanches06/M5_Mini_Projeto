import { IProject, Project } from "../../projects/index.js";
import {
  addElementInContainer,
  clearContainer,
} from "../dom/index.js";
import { createGanttStructure, renderGantt } from "./index.js";


/* Renderiza os projetos em cards */
export function renderProjectsCards(projects: IProject[]): void {
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

  projects.forEach((p) => {
    const card = createProjectCard(p as Project) as HTMLElement;
    card.style.cursor = "pointer";
    card.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const ganttElement = createGanttStructure(p as Project);
      clearContainer("#containerSection");
      addElementInContainer("#containerSection", ganttElement);
      await renderGantt(ganttElement, p as Project);
    });
    gridContainer.appendChild(card);
  });
}

/* Cria um card de projeto */
function createProjectCard(project: Project): HTMLElement {
  const card = document.createElement("div");
  card.className = "project-card";

  // HEADER
  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("h3");
  title.textContent = project.getName();

  header.appendChild(title);

  // STATUS
  const status = document.createElement("span");
  status.className = "project-status";
  status.textContent = project.getStatus();

  // DESCRIPTION
  const desc = document.createElement("p");
  desc.className = "project-desc";
  desc.textContent = project.getDescription() || "Sem descrição";

  // DATES
  const datesContainer = document.createElement("div");
  datesContainer.className = "project-dates";

  const startDate = document.createElement("span");
  startDate.className = "start-date";
  startDate.textContent = `Inicio: ${new Date(project.getStartDate()).toLocaleDateString("pt-BR")}`;

  const endDate = document.createElement("span");
  endDate.className = "end-date";
  endDate.textContent = `Fim: ${new Date(project.getEndDateExpected()).toLocaleDateString("pt-BR")}`;

  datesContainer.appendChild(startDate);
  datesContainer.appendChild(endDate);

  // Montar card
  card.appendChild(header);
  card.appendChild(status);
  card.appendChild(desc);
  card.appendChild(datesContainer);

  return card;
}


