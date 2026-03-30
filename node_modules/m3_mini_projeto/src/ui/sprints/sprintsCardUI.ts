import { addElementInContainer } from "../dom/index.js";
import {
  TaskService,
  UserService,
  SprintService,
  SprintTaskService,
} from "../../services/index.js";
import { IUser } from "../../models/index.js";
import { renderSprintModal } from "../modal/index.js";
import {
  getAvatarPath,
  showConfirmDialog,
  showInfoBanner,
} from "../../helpers/index.js";

/* Renderiza os sprints em cards na Grid principal */
export async function renderSprintsCards(
  sprints: any[],
  targetContainer?: HTMLElement,
): Promise<void> {
  let gridContainer: HTMLElement | null = null;

  if (targetContainer) {
    gridContainer = targetContainer.querySelector("#sprintsGridContainer");
  }

  if (!gridContainer) {
    gridContainer = document.querySelector(
      "#sprintsGridContainer",
    ) as HTMLElement;
  }

  if (!gridContainer) {
    gridContainer = document.createElement("div");
    gridContainer.id = "sprintsGridContainer";
    gridContainer.className = "sprints-grid-container";

    if (targetContainer) {
      targetContainer.appendChild(gridContainer);
    } else {
      addElementInContainer("#containerSection", gridContainer);
    }
  }

  gridContainer.innerHTML = "";

  for (const sprint of sprints) {
    const card = await createSprintCard(sprint);
    card.style.cursor = "pointer";
    gridContainer.appendChild(card);
  }
}

/* Cria a estrutura individual de cada card de sprint */
async function createSprintCard(sprint: any): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "sprint-card";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "sprint-card-content";

  // HEADER (Título)
  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("h3");
  title.textContent = sprint.name || "Sprint sem nome";

  const actions = document.createElement("div");
  actions.className = "sprint-card-actions";

  const allTasks = await TaskService.getTasks();
  const sprintTaskRelations = await SprintTaskService.getSprintTasks();
  const sprintRelations = sprintTaskRelations.filter(
    (relation: any) => relation.sprint_id === sprint.id,
  );

  const linkedTaskIds = new Set(
    sprintRelations.map((relation: any) => relation.task_id),
  );

  const projectId = sprint.projectId || sprint.project_id || sprint.project?.id;
  const availableTasks = allTasks.filter((task: any) => {
    const taskId = task.getId?.() ?? task.id;
    const taskProjectId = task.projectId || task.project_id || task.project?.id;
    const belongsToProject = projectId ? taskProjectId === projectId : true;
    return belongsToProject && !linkedTaskIds.has(taskId);
  });

  const editBtn = document.createElement("button");
  editBtn.className = "icon-button";
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.title = "Editar sprint";
  editBtn.setAttribute("aria-label", "Editar sprint");
  editBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!projectId) {
      showInfoBanner(
        "Projeto não encontrado para este sprint.",
        "error-banner",
      );
      return;
    }
    await renderSprintModal(projectId, sprint);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-button";
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.title = "Excluir sprint";
  deleteBtn.setAttribute("aria-label", "Excluir sprint");
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (
      await showConfirmDialog(
        `Tem certeza que deseja excluir o sprint "${sprint.name}"?`,
      )
    ) {
      try {
        await SprintService.deleteSprint(sprint.id);
        showInfoBanner(
          `Sprint "${sprint.name}" removido com sucesso.`,
          "success-banner",
        );
        const currentSprints = await SprintService.getSprints();
        await renderSprintsCards(currentSprints);
      } catch (error) {
        showInfoBanner(`Erro ao excluir sprint: ${error}`, "error-banner");
      }
    }
  });

  const linkSprintBtn = document.createElement("button");
  linkSprintBtn.className = "icon-button";
  linkSprintBtn.innerHTML = `<i class="fas fa-tasks"></i>
  <i class="fas fa-plus"></i>`;
  linkSprintBtn.title = "Associar tarefa ao sprint";
  linkSprintBtn.setAttribute("aria-label", "Associar tarefa ao sprint");
  linkSprintBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await handleSprintTaskLink(sprint);
  });
  linkSprintBtn.style.display = availableTasks.length > 0 ? "" : "none";

  const unlinkSprintBtn = document.createElement("button");
  unlinkSprintBtn.className = "icon-button";
  unlinkSprintBtn.innerHTML = `<i class="fas fa-tasks"></i>
  <i class="fas fa-minus"></i>`;
  unlinkSprintBtn.title = "Desassociar tarefa do sprint";
  unlinkSprintBtn.setAttribute("aria-label", "Desassociar tarefa do sprint");
  unlinkSprintBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await handleSprintTaskUnlink(sprint);
  });
  unlinkSprintBtn.style.display = sprintRelations.length > 0 ? "" : "none";

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  actions.appendChild(linkSprintBtn);
  actions.appendChild(unlinkSprintBtn);
  header.appendChild(title);

  // STATUS (Badge)
  const status = document.createElement("span");
  const statusText = sprint.getStatus?.() || sprint.status || "Ativo";
  status.className = `sprint-status status-${statusText.toLowerCase().replace(" ", "-")}`;
  status.textContent = statusText;

  // DESCRIPTION
  const desc = document.createElement("p");
  desc.className = "sprint-desc";
  desc.textContent = sprint.description || "Sem descrição disponível";

  // INFO (Container Flex)
  const infoContainer = document.createElement("div");
  infoContainer.className = "sprint-info";

  const startDate = document.createElement("span");
  startDate.className = "start-date";
  const startDateValue = sprint.startDate || sprint.start_date || new Date();
  startDate.textContent = `Início: ${new Date(startDateValue).toLocaleDateString("pt-BR")}`;

  const endDate = document.createElement("span");
  endDate.className = "end-date";
  const endDateValue = sprint.endDate || sprint.end_date || new Date();
  endDate.textContent = `Fim: ${new Date(endDateValue).toLocaleDateString("pt-BR")}`;

  infoContainer.appendChild(startDate);
  infoContainer.appendChild(endDate);

  const footer = document.createElement("div");
  footer.className = "sprint-card-footer";

  const avatarStack = document.createElement("div");
  avatarStack.className = "avatar-stack";

  try {
    // Carregar tasks do sprint através da relação sprint_tasks
    const allTasks = await TaskService.getTasks();
    const sprintTaskRelations = await SprintTaskService.getSprintTasks();
    const sprintTasks = allTasks.filter((task: any) =>
      sprintTaskRelations.some(
        (relation: any) =>
          relation.sprint_id === sprint.id &&
          (task.getId?.() ?? task.id) === relation.task_id,
      ),
    );

    // Extrair todos os user_ids únicos dos assignees
    const userIdsSet = new Set<number>();
    sprintTasks.forEach((task: any) => {
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
      const randomValue = (index % 4) + 1; // 1-4
      img.src = getAvatarPath(member.userId, member.gender, randomValue);
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
    console.error("Erro ao carregar membros do sprint:", error);
  }

  footer.appendChild(avatarStack);

  // Adicionar ao card na ordem correta
  contentWrapper.appendChild(header);
  contentWrapper.appendChild(status);
  contentWrapper.appendChild(desc);
  contentWrapper.appendChild(infoContainer);
  contentWrapper.appendChild(footer);
  card.append(contentWrapper, actions);

  return card;
}

async function handleSprintTaskLink(sprint: any): Promise<void> {
  try {
    const projectId = sprint.projectId || sprint.project_id || sprint.project?.id;
    const allTasks = await TaskService.getTasks();
    const sprintTaskRelations = await SprintTaskService.getSprintTasks();

    const linkedTaskIds = new Set(
      sprintTaskRelations
        .filter((relation: any) => relation.sprint_id === sprint.id)
        .map((relation: any) => relation.task_id),
    );

    const availableTasks = allTasks.filter((task: any) => {
      const taskId = task.getId?.() ?? task.id;
      const taskProjectId = task.projectId || task.project_id || task.project?.id;
      const belongsToProject = projectId ? taskProjectId === projectId : true;
      return belongsToProject && !linkedTaskIds.has(taskId);
    });

    if (availableTasks.length === 0) {
      showInfoBanner(
        "Não há tarefas disponíveis sem vínculo ao sprint.",
        "warning",
      );
      return;
    }

    await renderSprintTaskSelectionModal(
      sprint,
      availableTasks,
      "link",
    );
  } catch (error) {
    console.error("Erro ao carregar tarefas para associar ao sprint:", error);
    showInfoBanner("Erro ao carregar tarefas para associar ao sprint.", "error");
  }
}

async function handleSprintTaskUnlink(sprint: any): Promise<void> {
  try {
    const allTasks = await TaskService.getTasks();
    const sprintTaskRelations = await SprintTaskService.getSprintTasks();
    const sprintRelations = sprintTaskRelations.filter(
      (relation: any) => relation.sprint_id === sprint.id,
    );

    if (sprintRelations.length === 0) {
      showInfoBanner(
        "Este sprint não tem tarefas associadas.",
        "warning",
      );
      return;
    }

    const associatedTasks = sprintRelations
      .map((relation: any) => ({
        relation,
        task: allTasks.find(
          (task: any) => (task.getId?.() ?? task.id) === relation.task_id,
        ),
      }))
      .filter((item: any) => item.task);

    if (associatedTasks.length === 0) {
      showInfoBanner(
        "Não foi possível encontrar tarefas associadas a este sprint.",
        "warning",
      );
      return;
    }

    await renderSprintTaskSelectionModal(
      sprint,
      associatedTasks,
      "unlink",
    );
  } catch (error) {
    console.error("Erro ao carregar tarefas para desassociar do sprint:", error);
    showInfoBanner("Erro ao carregar tarefas para desassociar do sprint.", "error");
  }
}

function getTaskLabel(task: any): string {
  return (
    task.title ||
    task.name ||
    task.getTitle?.() ||
    task.getName?.() ||
    `Tarefa ${task.getId?.() ?? task.id}`
  );
}

async function renderSprintTaskSelectionModal(
  sprint: any,
  items: any[],
  mode: "link" | "unlink",
): Promise<void> {
  const modal = document.createElement("section");
  modal.className = "modal sprint-task-selection-modal";
  modal.id = `sprintTaskSelectionModal-${sprint.id}-${mode}`;

  const content = document.createElement("div");
  content.className = "modal-content";
  content.style.maxWidth = "1040px";
  content.style.width = "95%";
  content.style.padding = "42px";

  const title = document.createElement("h2");
  title.textContent =
    mode === "link"
      ? "Selecionar tarefa para associar ao sprint"
      : "Selecionar tarefa para desassociar do sprint";

  const list = document.createElement("div");
  list.className = "sprint-task-selection-list";
  list.style.display = "grid";
  list.style.gridTemplateColumns = "repeat(3, minmax(260px, 1fr))";
  list.style.gap = "1rem";
  list.style.marginTop = "1rem";

  items.forEach((item: any) => {
    const task = mode === "unlink" ? item.task : item;
    const relation = item.relation;
    const row = document.createElement("div");
    row.className = "sprint-task-selection-row";
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.padding = "0.8rem 1rem";
    row.style.background = "#f7f7f7";
    row.style.border = "1px solid rgba(0,0,0,0.08)";
    row.style.borderRadius = "8px";

    const label = document.createElement("span");
    label.textContent = getTaskLabel(task);
    label.style.fontSize = "0.95rem";
    label.style.color = "#1f2937";
    label.style.flex = "1";

    const button = document.createElement("button");
    button.className = "btn primary";
    button.innerHTML =
      mode === "link"
        ? `<i class="fas fa-plus"></i>`
        : `<i class="fas fa-minus"></i>`;
    button.title = mode === "link" ? "Associar tarefa" : "Desassociar tarefa";
    button.setAttribute(
      "aria-label",
      mode === "link" ? "Associar tarefa" : "Desassociar tarefa",
    );
    button.style.marginLeft = "0";
    button.style.padding = "0";
    button.style.width = "34px";
    button.style.height = "34px";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.fontSize = "1rem";
    button.style.minWidth = "auto";
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        if (mode === "link") {
          await SprintTaskService.createSprintTask({
            sprint_id: sprint.id,
            task_id: task.getId?.() ?? task.id,
          });
          showInfoBanner(
            `Tarefa "${getTaskLabel(task)}" associada ao sprint.`,
            "success",
          );
        } else {
          await SprintTaskService.deleteSprintTask(relation.id);
          showInfoBanner(
            `Tarefa "${getTaskLabel(task)}" desassociada do sprint.`,
            "success",
          );
        }

        modal.remove();
        const cardsContainer = document.querySelector(
          "#projectSprintsContainer",
        ) as HTMLElement;
        if (cardsContainer) {
          const currentSprints = await SprintService.getSprints();
          await renderSprintsCards(currentSprints, cardsContainer);
        }
      } catch (error) {
        console.error(error);
        showInfoBanner(
          "Erro ao atualizar a associação da tarefa.",
          "error",
        );
      }
    });

    row.append(label, button);
    list.appendChild(row);
  });

  content.append(title, list);
  modal.appendChild(content);
  document.body.appendChild(modal);
  modal.style.display = "block";

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
