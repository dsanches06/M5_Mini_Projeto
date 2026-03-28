import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";
import {
  UserService,
  TaskService,
  TaskAssigneeService,
  TagService,
} from "../../services/index.js";
import { GlobalValidators, StateTransitions } from "../../utils/index.js";
import {
  createButton,
  createForm,
  createInputGroup,
  createSection,
} from "../dom/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { IUser } from "../../models/index.js";

function setupEditTaskFormLogic(
  form: HTMLFormElement,
  fields: {
    title: HTMLInputElement;
    description: HTMLTextAreaElement;
    status: HTMLSelectElement;
    userAssign: HTMLSelectElement;
  },
  errors: {
    titleErr: HTMLElement;
  },
  tagCheckboxes: HTMLInputElement[],
  initialTagIds: Set<number>,
  modal: HTMLElement,
  task: ITask,
  user?: IUser,
): void {
  form.onsubmit = async (e: Event) => {
    e.preventDefault();

    const title = fields.title.value.trim();
    const description = fields.description.value.trim();
    const statusValue = fields.status.value as keyof typeof TaskStatus;
    const userValue = fields.userAssign.value;

    errors.titleErr.textContent = "";

    let isValid = true;

    if (!GlobalValidators.isNonEmpty(title)) {
      errors.titleErr.textContent = "O tírulo não pode estar vazio.";
      isValid = false;
    }

    if (!GlobalValidators.minLength(title, 3)) {
      errors.titleErr.textContent =
        "O título deve ter pelo menos 3 caracteres.";
      isValid = false;
    }

    if (!isValid) {
      showInfoBanner(
        `ERRO: A tarefa ${title} não foi atualizada. Verifique os erros no formulário.`,
        "error-banner",
      );
      return;
    }

    await handleTitleChange(task, title, user);
    await handleDescriptionChange(task, description, user);
    await handleStatusChange(task, statusValue, user);
    if (userValue === "") {
      await handleUnassign(task, fields, user);
    } else {
      await handleAssign(userValue, task, { ...fields, userAssign: fields.userAssign }, user);
    }
    await handleTagChange(task, tagCheckboxes, initialTagIds);
    modal.remove();
  };
}

async function handleTitleChange(task: ITask, title: string, user?: IUser) {
  if (title !== task.getTitle()) {
    try {
      // Atualizar tarefa via API
      const updated = await TaskService.updateTask(task.getId(), { title });
      if (updated) {
        const tasks = await TaskService.getTasks();
        // await renderDashboard(tasks, user);
        showInfoBanner(
          `INFO: O título da tarefa foi atualizado com sucesso.`,
          "success-banner",
        );
      } else {
        showInfoBanner(
          `ERRO: Não foi possível atualizar o título da tarefa.`,
          "error-banner",
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      showInfoBanner(
        `ERRO: Não foi possível atualizar a tarefa. Por favor, tente novamente.`,
        "error-banner",
      );
    }
  }
}

async function handleDescriptionChange(
  task: ITask,
  description: string,
  user?: IUser,
) {
  if ((task as ITask).setDescription && (task as ITask).getDescription) {
    const current = (task as ITask).getDescription() ?? "";
    if (description !== current) {
      try {
        // Atualizar tarefa via API
        const updated = await TaskService.updateTask(task.getId(), { description });
        if (updated) {
          const tasks = await TaskService.getTasks();
        //  await renderDashboard(tasks, user);
          showInfoBanner(
            `INFO: A descrição da tarefa foi atualizada com sucesso.`,
            "success-banner",
          );
        } else {
          showInfoBanner(
            `ERRO: Não foi possível atualizar a descrição da tarefa.`,
            "error-banner",
          );
        }
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        showInfoBanner(
          `ERRO: Não foi possível atualizar a tarefa. Por favor, tente novamente.`,
          "error-banner",
        );
      }
    }
  }
}

async function handleStatusChange(task: ITask, statusValue: string, user?: IUser) {
  const newStatus = (TaskStatus as any)[statusValue] as TaskStatus;
  if (newStatus && newStatus !== task.getStatus()) {
    // Verificar se a tarefa está atribuída (através de TaskAssignees)
    const hasAssignee = await hasTaskAssignee(task.getId());
    if (hasAssignee) {
      if (StateTransitions.validTransitions(task.getStatus(), newStatus)) {
        try {
          // Atualizar status da tarefa via API
          const updated = await TaskService.updateTaskStatus(task.getId(), getStatusId(newStatus));
          if (updated) {
            const tasks = await TaskService.getTasks();
            // await renderDashboard(tasks, user);
            showInfoBanner(
              `INFO: O estado da tarefa foi alterado com sucesso.`,
              "success-banner",
            );
          } else {
            showInfoBanner(
              `ERRO: Não foi possível atualizar o estado da tarefa.`,
              "error-banner",
            );
          }
        } catch (error) {
          console.error("Erro ao atualizar tarefa:", error);
          showInfoBanner(
            `ERRO: Não foi possível atualizar a tarefa. Por favor, tente novamente.`,
            "error-banner",
          );
        }
      } else {
        showInfoBanner(
          `ERRO: Transição não permitida.`,
          "error-banner",
        );
      }
    } else {
      showInfoBanner(
        `ERRO: A tarefa não pode mudar de status sem estar atribuída a um utilizador.`,
        "error-banner",
      );
    }
  }
}

/** Converter TaskStatus enum para ID */
function getStatusId(status: TaskStatus): number {
  const statusMap: { [key in TaskStatus]: number } = {
    [TaskStatus.CREATED]: 1,
    [TaskStatus.ASSIGNED]: 2,
    [TaskStatus.IN_PROGRESS]: 3,
    [TaskStatus.BLOCKED]: 4,
    [TaskStatus.COMPLETED]: 5,
    [TaskStatus.ARCHIVED]: 6,
  };
  return statusMap[status] || 1;
}

/** Verificar se uma tarefa tem pelo menos uma atribuição */
async function hasTaskAssignee(taskId: number): Promise<boolean> {
  try {
    const assignees = await TaskAssigneeService.getTaskAssignees();
    return assignees.some((a) => a.task_id === taskId);
  } catch (error) {
    console.error("Erro ao verificar atribuições:", error);
    return false;
  }
}

async function handleUnassign(task: ITask, fields: { status: HTMLSelectElement }, user?: IUser) {
  if (!task.getCompleted()) {
    fields.status.disabled = true;
    
    try {
      // Desatribuir tarefa via TaskAssigneeService API
      // Obter atribuições atuais da tarefa
      const assignees = await TaskAssigneeService.getTaskAssignees();
      const taskAssignees = assignees.filter(
        (a) => a.task_id === task.getId()
      );
      
      if (taskAssignees.length > 0) {
        // Remover todas as atribuições da tarefa
        for (const assignee of taskAssignees) {
          await TaskAssigneeService.deleteTaskAssignee(assignee.id);
        }
        
        const tasks = await TaskService.getTasks();
        // await renderDashboard(tasks, user);
        showInfoBanner(
          `INFO: A tarefa foi desvinculada com sucesso.`,
          "success-banner",
        );
      } else {
        showInfoBanner(
          `INFO: A tarefa já não estava atribuída.`,
          "info-banner",
        );
      }
    } catch (error) {
      console.error("Erro ao desatribuir tarefa:", error);
      showInfoBanner(
        `ERRO: Não foi possível desatribuir a tarefa. Por favor, tente novamente.`,
        "error-banner",
      );
    }
  } else {
    showInfoBanner(
      `ERRO: A tarefa não pode ser desvinculada pois já está concluída.`,
      "error-banner",
    );
  }
}

async function handleAssign(
  userValue: string,
  task: ITask,
  fields: { status: HTMLSelectElement; userAssign?: HTMLSelectElement },
  user?: IUser,
) {
  const userId = parseInt(userValue, 10);
  if (isNaN(userId)) return;
  if (!task.getCompleted()) {
    fields.status.disabled = true;
    
    try {
      // Verificar se já existe uma atribuição para este utilizador
      const assignees = await TaskAssigneeService.getTaskAssignees();
      const alreadyAssigned = assignees.some(
        (a) => a.task_id === task.getId() && a.user_id === userId
      );
      
      if (!alreadyAssigned) {
        // Atribuir tarefa a utilizador via TaskAssigneeService API
        const assigneeData = {
          task_id: task.getId(),
          user_id: userId,
        };
        
        const assigned = await TaskAssigneeService.createTaskAssignee(assigneeData);
        if (assigned) {
          // Get the assigned user name from the select field
          const selectedOption = fields.userAssign?.options[fields.userAssign.selectedIndex];
          const assignedUserName = selectedOption?.textContent || "";
          
          const tasks = await TaskService.getTasks();
          // await renderDashboard(tasks, user);
          showInfoBanner(
            `INFO: A tarefa foi atribuída para ${assignedUserName} com sucesso.`,
            "success-banner",
          );
        } else {
          showInfoBanner(
            `ERRO: Não foi possível atribuir a tarefa.`,
            "error-banner",
          );
        }
      } else {
        showInfoBanner(
          `INFO: A tarefa já estava atribuída a este utilizador.`,
          "info-banner",
        );
      }
    } catch (error) {
      console.error("Erro ao atribuir tarefa:", error);
      showInfoBanner(
        `ERRO: Não foi possível atribuir a tarefa. Por favor, tente novamente.`,
        "error-banner",
      );
    }
  } else {
    showInfoBanner(
      `ERRO: A tarefa já está concluída e não pode ser atribuída.`,
      "error-banner",
    );
  }
}

async function handleTagChange(
  task: ITask,
  tagCheckboxes: HTMLInputElement[],
  initialTagIds: Set<number>,
) {
  const selectedTagIds = tagCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));

  const tagsToAdd = selectedTagIds.filter((id) => !initialTagIds.has(id));
  const tagsToRemove = Array.from(initialTagIds).filter(
    (id) => !selectedTagIds.includes(id),
  );

  try {
    await Promise.all(
      tagsToAdd.map((tagId) => TaskService.addTagToTask(task.getId(), { tagId })),
    );
    await Promise.all(
      tagsToRemove.map((tagId) => TaskService.removeTagFromTask(task.getId(), tagId)),
    );
  } catch (error) {
    console.error("Erro ao atualizar tags da tarefa:", error);
    showInfoBanner(
      `ERRO: Não foi possível atualizar as tags da tarefa.`,
      "error-banner",
    );
  }
}

export async function renderEditTaskLeftPanel(
  task: ITask,
  user: IUser | undefined,
  modal: HTMLElement,
): Promise<{
  leftContainer: HTMLDivElement;
  form: HTMLFormElement;
  fields: {
    title: HTMLInputElement;
    description: HTMLTextAreaElement;
    status: HTMLSelectElement;
    user: HTMLSelectElement;
  };
  errors: {
    titleErr: HTMLElement;
  };
}> {
  const errorBanner = createSection("section") as HTMLElement;
  errorBanner.classList.add("error-banner");
  errorBanner.style.display = "none";

  const form = createForm("formEditTask") as HTMLFormElement;

  const titleData = createInputGroup(
    "Titulo",
    "editTaskTitle",
    "text",
    "editar o titulo da tarefa",
  );
  titleData.input.value = task.getTitle();

  const descriptionGroup = document.createElement("section");
  descriptionGroup.className = "form-group";

  const descriptionLabel = document.createElement("label");
  descriptionLabel.htmlFor = "editTaskDescription";
  descriptionLabel.textContent = "Descrição";

  const descriptionTextarea = document.createElement(
    "textarea",
  ) as HTMLTextAreaElement;
  descriptionTextarea.id = "editTaskDescription";
  descriptionTextarea.rows = 4;
  descriptionTextarea.placeholder = "Descreva a tarefa";
  try {
    descriptionTextarea.value = (task as ITask).getDescription
      ? ((task as ITask).getDescription() ?? "")
      : "";
  } catch (e) {
    descriptionTextarea.value = "";
  }

  descriptionGroup.append(descriptionLabel, descriptionTextarea);

  const statusGroup = document.createElement("section");
  statusGroup.className = "form-group";

  const statusLabel = document.createElement("label");
  statusLabel.htmlFor = "editTaskStatus";
  statusLabel.textContent = "Estado -> Mover para -> Novo Estado";

  const statusSelect = document.createElement("select") as HTMLSelectElement;
  statusSelect.id = "editTaskStatus";
  const statuses = Object.keys(TaskStatus) as Array<keyof typeof TaskStatus>;
  statuses.forEach((key) => {
    if (!isNaN(Number(key as any))) return;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    if ((TaskStatus as any)[key] === task.getStatus()) {
      option.selected = true;
    }
    statusSelect.appendChild(option);
  });
  statusGroup.append(statusLabel, statusSelect);

  const userGroup = document.createElement("section");
  userGroup.className = "form-group";

  const userLabel = document.createElement("label");
  userLabel.htmlFor = "editTaskUser";
  userLabel.textContent = "Atribuído a";

  const userSelect = document.createElement("select") as HTMLSelectElement;
  userSelect.id = "editTaskUser";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Nenhum";
  userSelect.appendChild(defaultOption);

  // Obter usuários ativos que ainda não estão atribuídos a nenhuma tarefa
  try {
    const allUsers = await UserService.getUsers();
    const allAssignees = await TaskAssigneeService.getTaskAssignees();
    
    // Extrair IDs dos utilizadores já atribuídos
    const assignedUserIds = new Set(allAssignees.map((a) => a.user_id));
    
    // Verificar se esta tarefa tem atribuição
    const taskAssignee = allAssignees.find((a) => a.task_id === task.getId());
    const taskAssignedUserId = taskAssignee?.user_id;
    
    // Filtrar: utilizadores ativos e não atribuídos a nenhuma tarefa, OU utilizador já atribuído a esta tarefa
    const usersActive = allUsers.filter((u) => {
      const isActive = typeof u.isActive === 'function' 
        ? u.isActive() 
        : (u as any).isActive;
      const userId = typeof u.getId === 'function' ? u.getId() : (u as any).id;
      
      // Mostrar se está ativo E (não está atribuído a nenhuma tarefa OU está atribuído a esta tarefa)
      return isActive && (!assignedUserIds.has(userId) || userId === taskAssignedUserId);
    });
    
    usersActive.forEach((u) => {
      const opt = document.createElement("option");
      const id = typeof u.getId === 'function' ? u.getId() : (u as any).id;
      const name = typeof u.getName === 'function' ? u.getName() : (u as any).name;
      opt.value = id.toString();
      opt.textContent = `${name} [ID: ${id}]`;
      
      // Se esta tarefa está atribuída a este utilizador, selecionar
      if (id === taskAssignedUserId) {
        opt.selected = true;
      }
      
      userSelect.appendChild(opt);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
  
  userGroup.append(userLabel, userSelect);

  const availableTags = await TagService.getTags();
  const initialTagIds = new Set<number>();
  const tagCheckboxes: HTMLInputElement[] = [];

  let taskTags: any[] = [];
  try {
    taskTags = await TaskService.getTaskTags(task.getId());
    taskTags.forEach((tag) => initialTagIds.add(tag.id));
  } catch (error) {
    console.warn("Erro ao carregar tags da tarefa:", error);
  }

  const tagSection = document.createElement("section");
  tagSection.className = "form-group";

  const tagLabel = document.createElement("label");
  tagLabel.textContent = "Tags";
  tagLabel.setAttribute("for", "editTaskTags");

  const tagContainer = document.createElement("div");
  tagContainer.style.display = "flex";
  tagContainer.style.flexWrap = "wrap";
  tagContainer.style.gap = "0.5rem";
  tagContainer.style.paddingTop = "0.4rem";

  if (availableTags.length === 0) {
    const noTags = document.createElement("p");
    noTags.textContent = "Nenhuma tag disponível. Crie tags primeiro.";
    noTags.style.margin = "0";
    noTags.style.color = "#777";
    tagContainer.appendChild(noTags);
  } else {
    availableTags.forEach((tag) => {
      const checkboxWrapper = document.createElement("label");
      checkboxWrapper.style.display = "inline-flex";
      checkboxWrapper.style.alignItems = "center";
      checkboxWrapper.style.gap = "0.25rem";
      checkboxWrapper.style.border = "1px solid #ccc";
      checkboxWrapper.style.borderRadius = "4px";
      checkboxWrapper.style.padding = "0.3rem 0.5rem";
      checkboxWrapper.style.backgroundColor = "#fff";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = String(tag.id);
      checkbox.checked = initialTagIds.has(tag.id);
      checkboxWrapper.appendChild(checkbox);

      const tagName = document.createElement("span");
      tagName.textContent = tag.name;
      tagName.style.fontSize = "0.85rem";
      tagName.style.color = "#333";
      checkboxWrapper.appendChild(tagName);

      tagContainer.appendChild(checkboxWrapper);
      tagCheckboxes.push(checkbox);
    });
  }

  const tagErrorSection = document.createElement("section");
  tagErrorSection.id = "editTaskTagsError";
  tagErrorSection.className = "error-message";

  tagSection.append(tagLabel, tagContainer, tagErrorSection);

  const submitBtn = createButton(
    "buttonEditTask",
    "Guardar",
    "submit",
  ) as HTMLButtonElement;

  form.append(
    titleData.section,
    descriptionGroup,
    statusGroup,
    userGroup,
    tagSection,
    submitBtn,
  );

  const leftContainer = document.createElement("div");
  leftContainer.className = "edit-task-left";
  leftContainer.style.flex = "1";
  leftContainer.append(errorBanner, form);

  setupEditTaskFormLogic(
    form,
    {
      title: titleData.input,
      description: descriptionTextarea,
      status: statusSelect,
      userAssign: userSelect,
    },
    {
      titleErr: titleData.errorSection,
    },
    tagCheckboxes,
    initialTagIds,
    modal,
    task,
    user,
  );

  return {
    leftContainer,
    form,
    fields: {
      title: titleData.input,
      description: descriptionTextarea,
      status: statusSelect,
      user: userSelect,
    },
    errors: {
      titleErr: titleData.errorSection,
    },
  };
}
