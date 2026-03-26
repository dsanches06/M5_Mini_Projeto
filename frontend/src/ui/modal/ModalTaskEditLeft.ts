import { ITask } from "../../tasks/index.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";
import {
  UserService,
  TaskService,
  AssignmentService,
} from "../../services/index.js";
import { GlobalValidators, StateTransitions } from "../../utils/index.js";
import {
  createButton,
  createForm,
  createInputGroup,
  createSection,
} from "../dom/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { renderDashboard } from "../dashboard/RenderDashBoardUI.js";
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
      await handleUnassign(task, fields);
    } else {
      await handleAssign(userValue, task, fields);
    }
    modal.remove();
  };
}

async function handleTitleChange(task: ITask, title: string, user?: IUser) {
  if (title !== task.getTitle()) {
    task.setTitle(title);

    const tasks = user ? [] : [];

    renderDashboard(tasks, user);
    showInfoBanner(
      `INFO: O título da tarefa "${task.getTitle()}" foi atualizado.`,
      "info-banner",
    );
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
      (task as ITask).setDescription(description);
      const tasks = user ? [] : [];
      renderDashboard(tasks, user);
      showInfoBanner(
        `INFO: A descrição da tarefa "${task.getTitle()}" foi atualizada.`,
        "info-banner",
      );
    }
  }
}

async function handleStatusChange(task: ITask, statusValue: string, user?: IUser) {
  const newStatus = (TaskStatus as any)[statusValue] as TaskStatus;
  if (newStatus && newStatus !== task.getStatus()) {
    if (task.getUser()) {
      if (StateTransitions.validTransitions(task.getStatus(), newStatus)) {
        task.moveTo(newStatus);
        const tasks = user ? [] : [];
        renderDashboard(tasks, user);
        showInfoBanner(
          `INFO: O estado da tarefa "${task.getTitle()}" foi alterado para ${TaskStatus[newStatus]}.`,
          "info-banner",
        );
      } else {
        showInfoBanner(
          `ERRO: Transição da tarefa ${task.getTitle()} do estado ${TaskStatus[task.getStatus()]} -> ${TaskStatus[newStatus]} não é permitida.`,
          "error-banner",
        );
      }
    } else {
      showInfoBanner(
        `ERRO: A tarefa "${task.getTitle()}" não pode mudar de status sem estar atribuída a um utilizador.`,
        "error-banner",
      );
    }
  }
}

async function handleUnassign(task: ITask, fields: { status: HTMLSelectElement }) {
  const currentUser = task.getUser();
  if (currentUser) {
    if (!task.getCompleted()) {
      fields.status.disabled = true;
      // TODO: Implementar unassign via API
      // await AssignmentService.unassignUser(task.getId(), currentUser.getId());
      const user = task.getUser();
      const tasks = user ? [] : [];
      renderDashboard(tasks, user);
      showInfoBanner(
        `INFO: A tarefa "${task.getTitle()}" foi desvinculada do utilizador "${currentUser.getName()}" com sucesso.`,
        "info-banner",
      );
    } else {
      showInfoBanner(
        `ERRO: A tarefa "${task.getTitle()}" não pode ser desvinculada pois já está concluída.`,
        "error-banner",
      );
    }
  }
}

async function handleAssign(
  userValue: string,
  task: ITask,
  fields: { status: HTMLSelectElement },
) {
  const userId = parseInt(userValue, 10);
  if (isNaN(userId)) return;
  if (!task.getCompleted()) {
    fields.status.disabled = true;
    const currentUser = task.getUser();
    if (!currentUser || currentUser.getId() !== userId) {
      // TODO: Implementar assign via API
      // await AssignmentService.assignUser(task.getId(), userId);
      const user = task.getUser();
      const tasks = user ? [] : [];
      renderDashboard(tasks, user);
      showInfoBanner(
        `INFO: A tarefa "${task.getTitle()}" foi atribuída ao utilizador "${user?.getName()}" com sucesso.`,
        "info-banner",
      );
    }
  } else {
    showInfoBanner(
      `ERRO: A tarefa "${task.getTitle()}" não pode ser atribuída pois já está concluída.`,
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

  // TODO: Obter usuários ativos da API
  try {
    const allUsers = await UserService.getUsers();
    const usersActive = allUsers.filter((u) => {
      const isActive = typeof u.isActive === 'function' 
        ? u.isActive() 
        : (u as any).isActive;
      return isActive;
    });
    usersActive.forEach((u) => {
      const opt = document.createElement("option");
      const id = typeof u.getId === 'function' ? u.getId() : (u as any).id;
      const name = typeof u.getName === 'function' ? u.getName() : (u as any).name;
      opt.value = id.toString();
      opt.textContent = `${name} [ID: ${id}]`;
      if (task.getUser() && task.getUser()!.getId() === id)
        opt.selected = true;
      userSelect.appendChild(opt);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
  
  userGroup.append(userLabel, userSelect);

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
