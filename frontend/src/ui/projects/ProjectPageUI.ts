import { IProject, Project } from "../../projects/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { ProjectService } from "../../services/index.js";
import { renderProjectModal } from "../modal/ModalProjectForm.js";
import {
  addElementInContainer,
  createHeadingTitle,
  createSearchContainer,
  clearContainer,
} from "../dom/index.js";
import { createGanttStructure, renderGantt } from "./index.js";

/* Lista de projetos */
export function loadProjectsPage(projects: IProject[]): void {
  clearContainer("#containerSection");

  addElementInContainer(
    "#containerSection",
    createHeadingTitle("h2", "GESTÃO DE PROJETOS"),
  );

  const searchContainer = showSearchProjectContainer();
  addElementInContainer("#containerSection", searchContainer);

  // renderizar projetos em cards
  renderProjectsCards(projects);

  // Event listener para busca
  const searchProjectInput = document.querySelector(
    "#searchProject",
  ) as HTMLInputElement;
  if (searchProjectInput) {
    searchProjectInput.addEventListener("input", async () => {
      const searchTerm = searchProjectInput.value;
      const searchedProjects = await ProjectService.getProjects(
        undefined,
        searchTerm,
      );
      renderProjectsCards(searchedProjects);
    });
  } else {
    console.warn("Elemento de busca de projetos não encontrado.");
  }

  // Event listener para adicionar projeto
  const addProjectBtn = document.querySelector("#addProjectBtn") as HTMLElement;
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      renderProjectModal();
    });
  }

  // Event listener para ordenar projetos
  const sortProjectsBtn = document.querySelector(
    "#sortProjectsBtn",
  ) as HTMLElement;
  if (sortProjectsBtn) {
    let isAscending = true;
    sortProjectsBtn.addEventListener("click", async () => {
      const sortValue = isAscending ? "asc" : "desc";
      const sortedProjects = await ProjectService.getProjects(sortValue);
      isAscending = !isAscending;
      renderProjectsCards(sortedProjects);
      sortProjectsBtn.textContent = isAscending ? "Ordenar A-Z" : "Ordenar Z-A";
    });
  }
}

/* Cria o container de busca */
function showSearchProjectContainer(): HTMLElement {
  const searchProjectContainer = createSearchContainer(
    "searchProjectContainer",
    { id: "searchProject", placeholder: "Procurar projeto..." },
    [
      { id: "addProjectBtn", text: "Novo projeto" },
      { id: "sortProjectsBtn", text: "Ordenar A-Z" },
    ],
  );
  searchProjectContainer.classList.add("search-add-container");
  return searchProjectContainer;
}

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
    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const ganttElement = createGanttStructure(p as Project);
      clearContainer("#containerSection");
      addElementInContainer("#containerSection", ganttElement);
      renderGantt(ganttElement, p as Project);
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
