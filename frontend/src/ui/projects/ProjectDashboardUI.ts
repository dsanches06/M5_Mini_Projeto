import { IProject, Project } from "../../projects/index.js";
// Nota: addElementInContainer pode ser usado para anexar o componente ao body
import { addElementInContainer } from "../dom/index.js";
import { TaskService } from "../../services/index.js";
import { ITask } from "../../tasks/index.js";

/**
 * Cria a casca (HTML) do componente
 */
export function createGanttStructure(project: Project): HTMLElement {
  const container = document.createElement('div');
  container.id = 'gantt-container';
  container.className = 'gantt-container';

  const header = document.createElement('section');
  header.className = 'gantt-header';
  
  const titleSection = document.createElement('div');
  titleSection.className = 'gantt-title-section';

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
  legend.className = 'gantt-legend';

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
export async function renderGantt(container: HTMLElement, project?: Project): Promise<void> {
  const grid = container.querySelector("#gantt-grid") as HTMLElement;
  const legend = container.querySelector("#gantt-legend") as HTMLElement;

  if (!grid || !legend || !project) return;

  try {
    // Obter tarefas do projeto da API
    const tasks = await TaskService.getTasksByProject(project.getId());
    
    if (tasks.length === 0) {
      grid.innerHTML = '<p style="padding: 20px; text-align: center; color: #95a5a6;">Nenhuma tarefa encontrada para este projeto</p>';
      return;
    }

    // Calcular semanas do projeto
    const startDate = new Date(project.getStartDate());
    const endDate = new Date(project.getEndDateExpected());
    const weeks = calculateWeeks(startDate, endDate);

    // Renderizar cabeçalho com semanas
    renderWeekHeader(grid, weeks);

    // Renderizar taks e activities
    renderTasks(grid, tasks, weeks, startDate);

    // Renderizar legendas dinâmicas (baseadas nas categorias das tasks)
    renderLegend(legend, tasks);

  } catch (error) {
    console.error('Erro ao renderizar Gantt:', error);
    grid.innerHTML = '<p style="padding: 20px; text-align: center; color: #e74c3c;">Erro ao carregar dados do Gantt</p>';
  }
}

/**
 * Calcula o número de semanas entre duas datas
 */
function calculateWeeks(startDate: Date, endDate: Date): number {
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.ceil(daysDiff / 7) || 1;
}

/**
 * Renderiza o cabeçalho com as semanas
 */
function renderWeekHeader(container: HTMLElement, weeks: number): void {
  const headerRow = document.createElement('div');
  headerRow.className = 'gantt-week-header';

  const taskNameCell = document.createElement('div');
  taskNameCell.className = 'gantt-task-name-header';
  taskNameCell.textContent = '';
  headerRow.appendChild(taskNameCell);

  for (let i = 1; i <= weeks; i++) {
    const weekCell = document.createElement('div');
    weekCell.className = 'gantt-week-cell';
    weekCell.textContent = `WEEK ${i}`;
    headerRow.appendChild(weekCell);
  }

  container.appendChild(headerRow);
}

/**
 * Renderiza as tarefas com suas atividades
 */
function renderTasks(container: HTMLElement, tasks: ITask[], weeks: number, projectStartDate: Date): void {
  const colors = [
    { bg: '#f8a1a1', border: '#d87171' }, // Rosa
    { bg: '#f5b77d', border: '#d99b5e' }, // Laranja
    { bg: '#e8d5a8', border: '#c9ae7d' }, // Bege
    { bg: '#a8b8c4', border: '#7a8a99' }, // Cinza azulado
    { bg: '#7a9cc4', border: '#5479a0' }, // Azul
  ];

  let colorIndex = 0;

  tasks.forEach((task) => {
    // Renderizar linha da task
    const taskRow = document.createElement('div');
    taskRow.className = 'gantt-task-row';

    const taskNameCell = document.createElement('div');
    taskNameCell.className = 'gantt-task-name';
    taskNameCell.textContent = task.getTitle();
    taskRow.appendChild(taskNameCell);

    // Células vazias para as semanas
    for (let i = 0; i < weeks; i++) {
      const cell = document.createElement('div');
      cell.className = 'gantt-week-cell';
      taskRow.appendChild(cell);
    }

    container.appendChild(taskRow);
    colorIndex = (colorIndex + 1) % colors.length;

    // Renderizar activities/assignees da task
    if ((task as any).getAssignees && (task as any).getAssignees().length > 0) {
      const assignees = (task as any).getAssignees();
      
      assignees.forEach((assignee: any, index: number) => {
        const activityRow = document.createElement('div');
        activityRow.className = 'gantt-activity-row';

        const activityNameCell = document.createElement('div');
        activityNameCell.className = 'gantt-activity-name';
        activityNameCell.textContent = `Activity ${index + 1}`;
        activityRow.appendChild(activityNameCell);

        // Criar barra de atividade
        const startWeek = Math.floor(Math.random() * (weeks - 2));
        const duration = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < weeks; i++) {
          const cell = document.createElement('div');
          cell.className = 'gantt-week-cell';

          // Se a célula estiver no intervalo da atividade
          if (i >= startWeek && i < startWeek + duration) {
            const bar = document.createElement('div');
            bar.className = 'gantt-activity-bar';
            const color = colors[colorIndex];
            bar.style.backgroundColor = color.bg;
            bar.style.borderColor = color.border;
            
            // Adicionar nome do assignee se disponível
            if (assignee.user_id) {
              bar.textContent = `User ${assignee.user_id}`;
            }
            
            cell.appendChild(bar);
          }

          activityRow.appendChild(cell);
        }

        container.appendChild(activityRow);
      });
    } else {
      // Se não houver assignees, criar uma atividade padrão
      const activityRow = document.createElement('div');
      activityRow.className = 'gantt-activity-row';

      const activityNameCell = document.createElement('div');
      activityNameCell.className = 'gantt-activity-name';
      activityNameCell.textContent = 'Activity 1';
      activityRow.appendChild(activityNameCell);

      const startWeek = 0;
      const duration = 1;

      for (let i = 0; i < weeks; i++) {
        const cell = document.createElement('div');
        cell.className = 'gantt-week-cell';

        if (i >= startWeek && i < startWeek + duration) {
          const bar = document.createElement('div');
          bar.className = 'gantt-activity-bar';
          const color = colors[colorIndex];
          bar.style.backgroundColor = color.bg;
          bar.style.borderColor = color.border;
          bar.textContent = 'Unassigned';
          cell.appendChild(bar);
        }

        activityRow.appendChild(cell);
      }

      container.appendChild(activityRow);
    }
  });
}

/**
 * Renderiza a legenda dinâmica baseada nas tarefas
 */
function renderLegend(container: HTMLElement, tasks: ITask[]): void {
  const categories = ['Engineering', 'Research', 'Product', 'Marketing', 'Copywriting', 'Business'];
  
  const legendItems = categories.map((category, index) => {
    const item = document.createElement('div');
    item.className = 'gantt-legend-item';
    item.textContent = category;
    return item;
  });

  container.innerHTML = '';
  legendItems.forEach(item => container.appendChild(item));
}



