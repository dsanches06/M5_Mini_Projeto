import { IProject, Project } from "../../projects/index.js";
// Nota: addElementInContainer pode ser usado para anexar o componente ao body
import { addElementInContainer } from "../dom/index.js";

/**
 * Cria a casca (HTML) do componente
 */
export function createGanttStructure(project: Project): HTMLElement {
  const container = document.createElement('div');
  container.id = 'gantt-container';
  container.className = 'project-card';

  const header = document.createElement('section');
  const titleSection = document.createElement('div');
  titleSection.className = 'title-section';

  const h1 = document.createElement('h1');
  h1.textContent = project.getName().toUpperCase();

  const p = document.createElement('p');
  const endDate = new Date(project.getEndDateExpected());
  const formattedDate = endDate.toLocaleDateString('pt', { year: 'numeric', month: 'long' });
  p.textContent = formattedDate;

  titleSection.appendChild(h1);
  titleSection.appendChild(p);

  const legend = document.createElement('div');
  legend.id = 'legend';
  legend.className = 'legend';

  header.appendChild(titleSection);
  header.appendChild(legend);

  const ganttGrid = document.createElement('div');
  ganttGrid.id = 'gantt-grid';
  ganttGrid.className = 'gantt-grid';

  container.appendChild(header);
  container.appendChild(ganttGrid);

  return container;
}

/**
 * Preenche a estrutura com os dados do projeto
 */
export function renderGantt(container: HTMLElement, project?: Project): void {
  const grid = container.querySelector("#gantt-grid") as HTMLElement;
  const legend = container.querySelector("#legend") as HTMLElement;

  if (!grid || !legend) return;

  // TODO: Renderizar legendas dinâmicas baseadas nos dados do projeto
  // TODO: Renderizar semanas do projeto
  // TODO: Renderizar tasks e activities do projeto
}



