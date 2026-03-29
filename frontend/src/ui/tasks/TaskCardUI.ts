import { ITask } from "../../tasks/index.js";
import { IUser } from "../../models/index.js";
import {
  getCardBorderColor,
  setCardBorderColor,
  showConfirmDialog,
  showInfoBanner,
} from "../../helpers/index.js";
import { loadTaskDetailPage } from "./TaskDetailPageUI.js";
import { renderTaskModal } from "../modal/index.js";
import { TaskService, TaskAssigneeService, TagService, UserService } from "../../services/index.js";

export async function createTaskCard(
  task: ITask,
  userMap: Map<number, IUser>,
): Promise<HTMLElement> {
  const assigneeName = getAssigneeNameFromMap(task, userMap);
  return await buildTaskCard(task, assigneeName);
}

export async function renderTaskCards(
  container: HTMLElement,
  tasks: ITask[],
): Promise<void> {
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "1fr";
  container.style.gap = "1rem";

  for (const task of tasks) {
    const taskCard = await createTaskCardElement(task);
    container.appendChild(taskCard);
  }
}

async function createTaskCardElement(task: ITask): Promise<HTMLElement> {
  const assigneeName = await getAssigneeNameRemote(task);
  return await buildTaskCard(task, assigneeName);
}

function getAssigneeNameFromMap(
  task: ITask,
  userMap: Map<number, IUser>,
): string {
  const assignees = task.getAssignees?.() || [];
  if (assignees.length === 0) {
    return "Sem atribuição";
  }

  const firstAssignee = assignees[0];
  const user = userMap.get(firstAssignee.user_id);
  return user ? user.getName().split(" ")[0] : "Sem atribuição";
}

async function getAssigneeNameRemote(task: ITask): Promise<string> {
  const assignees = task.getAssignees?.() || [];
  if (assignees.length === 0) {
    return "Sem atribuição";
  }

  const firstAssignee = assignees[0];
  try {
    const allUsers = await UserService.getUsers();
    const user = allUsers.find(
      (user: IUser) => user.getId() === firstAssignee.user_id,
    );
    return user ? user.getName().split(" ")[0] : "Sem atribuição";
  } catch (error) {
    showInfoBanner("Erro ao carregar informações do utilizador.", "error");
    return "Sem atribuição";
  }
}

async function buildTaskCard(
  task: ITask,
  assigneeName: string,
): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("data-task-id", task.getId().toString());

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "task-card-content";
  contentWrapper.innerHTML = `
    <h3 class="task-title">${task.getTitle()}</h3>
    <div class="task-meta">
      <span class="task-user">${assigneeName}</span>
      <span class="task-status">${task.getStatus()}</span>
    </div>
  `;

  try {
    const tags = await TaskService.getTaskTags(task.getId());
    if (tags.length > 0) {
      const tagsWrapper = document.createElement("div");
      tagsWrapper.className = "task-tags";

      tags.forEach((tag: any) => {
        const tagPill = document.createElement("span");
        tagPill.className = "task-tag-pill";
        tagPill.textContent = tag.name || "Tag";
        tagsWrapper.appendChild(tagPill);
      });

      contentWrapper.appendChild(tagsWrapper);
    }
  } catch (error) {
    console.error("Erro ao carregar tags da tarefa:", error);
  }

  const actions = document.createElement("div");
  actions.className = "task-card-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "icon-button";
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.title = "Editar tarefa";
  editBtn.setAttribute("aria-label", "Editar tarefa");
  editBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    const projectId = getTaskProjectId(task);
    if (!projectId) {
      showInfoBanner("Não foi possível obter o projeto da tarefa.", "error");
      return;
    }

    await renderTaskModal(projectId, task, undefined, async () => {
      window.location.reload();
    });
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-button";
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.title = "Excluir tarefa";
  deleteBtn.setAttribute("aria-label", "Excluir tarefa");
  deleteBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    const confirmed = await showConfirmDialog(
      `Tem certeza que deseja excluir a tarefa "${task.getTitle()}"?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await TaskService.deleteTask(task.getId());
      showInfoBanner("Tarefa excluída com sucesso.", "success");
      window.location.reload();
    } catch (error) {
      showInfoBanner("Erro ao excluir a tarefa.", "error");
      console.error(error);
    }
  });

  const assignResponsibleBtn = document.createElement("button");
  assignResponsibleBtn.className = "icon-button";
  assignResponsibleBtn.innerHTML = `<i class="fas fa-user-plus"></i>`;
  assignResponsibleBtn.title = "Atribuir responsável";
  assignResponsibleBtn.setAttribute("aria-label", "Atribuir responsável");
  assignResponsibleBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    //await handleTaskAssigneeAssign(task);
  });

  const removeResponsibleBtn = document.createElement("button");
  removeResponsibleBtn.className = "icon-button";
  removeResponsibleBtn.innerHTML = `<i class="fas fa-user-minus"></i>`;
  removeResponsibleBtn.title = "Remover responsável";
  removeResponsibleBtn.setAttribute("aria-label", "Remover responsável");
  removeResponsibleBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    //await handleTaskAssigneeRemove(task);
  });

  const currentAssignees = task.getAssignees?.() || [];
  removeResponsibleBtn.style.display = currentAssignees.length > 0 ? "" : "none";

  const addTagBtn = document.createElement("button");
  addTagBtn.className = "icon-button";
  addTagBtn.innerHTML = `<i class="fas fa-tags"></i>
  <i class="fa-sharp fa-solid fa-plus"></i>`;
  addTagBtn.title = "Adicionar tag";
  addTagBtn.setAttribute("aria-label", "Adicionar tag");
  addTagBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTaskTagModal(task, "add");
  });

  const deleteTagBtn = document.createElement("button");
  deleteTagBtn.className = "icon-button";
  deleteTagBtn.innerHTML = `<i class="fas fa-tags"></i>
  <i class="fa-sharp fa-solid fa-minus"></i>`;
  deleteTagBtn.title = "Remover tag";
  deleteTagBtn.setAttribute("aria-label", "Remover tag");
  deleteTagBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTaskTagModal(task, "remove");
  });

  actions.append(editBtn, deleteBtn, assignResponsibleBtn, removeResponsibleBtn, addTagBtn, deleteTagBtn);
  card.append(contentWrapper, actions);

  setCardBorderColor(card, getCardBorderColor(task.getStatus()));
  card.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest(".icon-button")) {
      return;
    }
    loadTaskDetailPage(task.getId());
  });
  return card;
}

async function renderTaskTagModal(
  task: ITask,
  action: "add" | "remove",
): Promise<void> {
  try {
    const taskId = task.getId();
    const allTags = await TagService.getTags();
    const taskTags = await TaskService.getTaskTags(taskId);

    const taskTagIds = new Set<number>(taskTags.map((tag: any) => tag.id));
    const availableTags =
      action === "add"
        ? allTags.filter((tag: any) => !taskTagIds.has(tag.id))
        : taskTags;

    const modal = document.createElement("section");
    modal.className = "modal";
    modal.id = `taskTagModal-${taskId}-${action}`;

    const content = document.createElement("div");
    content.className = "modal-content";
    content.style.maxWidth = "460px";

    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = () => modal.remove();

    const title = document.createElement("h2");
    title.textContent =
      action === "add" ? "Adicionar tags à tarefa" : "Remover tags da tarefa";

    const description = document.createElement("p");
    description.textContent =
      action === "add"
        ? "Selecione uma ou mais tags para adicionar à tarefa."
        : "Selecione uma ou mais tags para remover desta tarefa.";
    description.style.marginBottom = "1rem";

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "1rem";

    const tagsContainer = document.createElement("div");
    tagsContainer.style.display = "grid";
    tagsContainer.style.gridTemplateColumns = "1fr";
    tagsContainer.style.gap = "0.5rem";
    tagsContainer.style.maxHeight = "260px";
    tagsContainer.style.overflowY = "auto";
    tagsContainer.style.padding = "0.4rem 0";

    if (availableTags.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent =
        action === "add"
          ? "Não há tags disponíveis para adicionar."
          : "Esta tarefa não possui tags para remover.";
      emptyMessage.style.margin = "0";
      emptyMessage.style.color = "#5c5c5c";
      tagsContainer.appendChild(emptyMessage);
    } else {
      availableTags.forEach((tag: any) => {
        const tagOption = document.createElement("label");
        tagOption.style.display = "flex";
        tagOption.style.alignItems = "center";
        tagOption.style.gap = "0.6rem";
        tagOption.style.padding = "0.65rem 0.75rem";
        tagOption.style.border = "1px solid #d1d5db";
        tagOption.style.borderRadius = "6px";
        tagOption.style.backgroundColor = "#fff";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = String(tag.id);
        checkbox.style.cursor = "pointer";

        const tagLabel = document.createElement("span");
        tagLabel.textContent = tag.name;
        tagLabel.style.fontSize = "0.95rem";
        tagLabel.style.color = "#1f2937";

        tagOption.append(checkbox, tagLabel);
        tagsContainer.appendChild(tagOption);
      });
    }

    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    buttonGroup.style.justifyContent = "flex-end";
    buttonGroup.style.gap = "0.75rem";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "icon-button";
    cancelButton.textContent = "Cancelar";
    cancelButton.addEventListener("click", () => modal.remove());

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "icon-button";
    submitButton.textContent = action === "add" ? "Adicionar" : "Remover";

    buttonGroup.append(cancelButton, submitButton);
    form.append(tagsContainer, buttonGroup);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const selectedTagIds = Array.from(
        tagsContainer.querySelectorAll("input[type=checkbox]:checked"),
      ).map((input) => Number((input as HTMLInputElement).value));

      if (selectedTagIds.length === 0) {
        showInfoBanner("Selecione ao menos uma tag.", "error");
        return;
      }

      try {
        if (action === "add") {
          for (const tagId of selectedTagIds) {
            await TaskService.addTagToTask(taskId, { tagId });
          }
          showInfoBanner("Tags adicionadas com sucesso.", "success");
        } else {
          for (const tagId of selectedTagIds) {
            await TaskService.removeTagFromTask(taskId, tagId);
          }
          showInfoBanner("Tags removidas com sucesso.", "success");
        }
        modal.remove();
        window.location.reload();
      } catch (error) {
        showInfoBanner("Erro ao atualizar tags da tarefa.", "error");
        console.error("Erro ao atualizar tags da tarefa:", error);
      }
    });

    content.append(closeBtn, title, description, form);
    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.style.display = "block";
  } catch (error) {
    showInfoBanner("Erro ao abrir o modal de tags.", "error");
    console.error("Erro ao renderizar modal de tags:", error);
  }
}

function getTaskProjectId(task: ITask): number | null {
  const project = task.getProject?.();
  if (project && typeof project.getId === "function") {
    return project.getId();
  }
  const anyTask = task as any;
  return anyTask.project_id || anyTask.project?.id || null;
}
