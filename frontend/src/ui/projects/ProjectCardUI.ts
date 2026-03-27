import { IProject, Project } from "../../projects/index.js";
import { addElementInContainer, clearContainer } from "../dom/index.js";
import { renderProjectDashboard } from "./index.js";

/* Renderiza os projetos em cards na Grid principal */
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
    const card = createProjectCard(p as Project);
    card.style.cursor = "pointer";

    card.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearContainer("#containerSection");
      const ganttElement = await renderProjectDashboard(p.getId());
      addElementInContainer("#containerSection", ganttElement);
    });

    gridContainer.appendChild(card);
  });
}

/* Cria a estrutura individual de cada card de projeto */
function createProjectCard(project: Project): HTMLElement {
  const card = document.createElement("div");
  card.className = "project-card";

  // HEADER (Título e Botões de Opções se existirem)
  const header = document.createElement("div");
  header.className = "card-header";
  const title = document.createElement("h3");
  title.textContent = project.getName();
  header.appendChild(title);

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

  // FOOTER COM AVATARES (O que pediste)
  const footer = document.createElement("div");
  footer.className = "project-card-footer";

  const avatarStack = document.createElement("div");
  avatarStack.className = "avatar-stack";

  // Simulação de membros (Idealmente: project.getMembers())
  const members = [1, 2, 3, 4];
  const displayLimit = 3; // Quantos mostrar antes do "+"

  members.slice(0, displayLimit).forEach((_, index) => {
    const img = document.createElement("img");
    img.className = "avatar-img";
    // Corrigido: URL do pravatar com template literals
    img.src = `https://i.pravatar.cc{project.getId()}-${index}`;
    avatarStack.appendChild(img);
  });

  if (members.length > displayLimit) {
    const more = document.createElement("span");
    more.className = "avatar-more";
    more.textContent = `${members.length - displayLimit}+`;
    avatarStack.appendChild(more);
  }

  footer.appendChild(avatarStack);

  // PROGRESS BAR
  const progressWrapper = document.createElement("div");
  progressWrapper.className = "project-progress-wrapper";

  const progressBar = document.createElement("div");
  progressBar.className = "project-progress-bar";

  // Aqui podes usar um valor real da API (ex: project.getProgress())
  // ou um valor fixo para teste como 40%
  const progressValue = 40;

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
