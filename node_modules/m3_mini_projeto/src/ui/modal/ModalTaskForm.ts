import { IUser } from "../../models/index.js";
import { GlobalValidators } from "../../utils/index.js";
import { TaskService } from "../../services/index.js";

import {
  createButton,
  createForm,
  createHeadingTitle,
  createInputGroup,
  createSection,
  createSelectGroup,
} from "../dom/index.js";
import { showInfoBanner } from "../../helpers/index.js";

function setupTaskFormLogic(
  form: HTMLFormElement,
  fields: {
    title: HTMLInputElement;
    category: HTMLSelectElement;
    type: HTMLSelectElement;
  },
  errors: {
    titleErr: HTMLElement;
    categoryErr: HTMLElement;
    typeErr: HTMLElement;
  },
  modal: HTMLElement,
  projectId: number,
  taskToEdit?: any,
  user?: IUser,
  onSuccess?: () => Promise<void> | void,
): void {
  form.onsubmit = async (e: Event) => {
    e.preventDefault();

    const title: string = fields.title.value;
    const category: string = fields.category.value;
    const type: string = fields.type.value;

    // Reset de estados
    errors.titleErr.textContent = "";
    errors.categoryErr.textContent = "";
    errors.typeErr.textContent = "";

    let isValid = true;

    if (!GlobalValidators.minLength(title.trim(), 3)) {
      errors.titleErr.textContent = "O titulo deve ter pelo menos 3 caracteres.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(title.trim())) {
      errors.titleErr.textContent = "O titulo não pode estar vazio.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(category.trim())) {
      errors.categoryErr.textContent = "A categoria não pode estar vazia.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(type.trim())) {
      errors.typeErr.textContent = "O tipo não pode estar vazio.";
      isValid = false;
    }

    if (isValid) {
      const taskId = taskToEdit?.id ?? taskToEdit?.getId?.();
      const taskData = {
        id: taskId || 0,
        project_id: projectId,
        title: title.trim(),
        category: category.trim(),
        type: type.trim(),
      };

      try {
        if (taskToEdit) {
          await TaskService.updateTask(taskId, taskData);

          showInfoBanner(
            `INFO: A tarefa "${title}" foi atualizada com sucesso.`,
            "success-banner",
          );
        } else {
          await TaskService.createTask(taskData);

          showInfoBanner(
            `INFO: A tarefa "${title}" foi criada com sucesso.`,
            "success-banner",
          );
        }
        modal.remove();
        if (onSuccess) await onSuccess();
      } catch (error) {
        const action = taskToEdit ? "atualizar" : "criar";
        showInfoBanner(
          `ERRO: Não foi possível ${action} a tarefa.`,
          "error-banner",
        );
        console.error(`Erro ao ${action} tarefa:`, error);
      }
    } else {
      showInfoBanner(
        `ERRO: Verifique os erros no formulário.`,
        "error-banner",
      );
    }
  };
}

/**
 *  Função Principal: Monta o Modal no DOM
 * @param projectId - ID do projeto ao qual a tarefa pertence (obrigatório)
 * @param taskToEdit - Tarefa existente para edição (opcional). Se não fornecido, modo CREATE
 * @param user - Utilizador atual (opcional)
 */
export async function renderTaskModal(
  projectId: number,
  taskToEdit?: any,
  user?: IUser,
  onSuccess?: () => Promise<void> | void,
): Promise<void> {
  const modal = createSection("modalTaskForm") as HTMLElement;
  modal.classList.add("modal");

  const content = createSection("modalTaskContent") as HTMLElement;
  content.classList.add("modal-content");

  const closeBtn = document.createElement("span") as HTMLSpanElement;
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const titleHeading = createHeadingTitle(
    "h2",
    taskToEdit ? "Editar Tarefa" : "Adicionar Tarefa",
  ) as HTMLHeadingElement;

  const form = createForm("formTask") as HTMLFormElement;

  // Criação dos campos usando a função auxiliar
  const titleData = createInputGroup(
    "Titulo",
    "taskTitleInput",
    "text",
    "inserir o titulo da tarefa",
  );
  const titleValue =
    taskToEdit?.title ?? taskToEdit?.getTitle?.() ?? "";
  if (titleValue) {
    (titleData.input as HTMLInputElement).value = titleValue;
  }

  const taskCategory = ["Trabalho", "Pessoal", "Estudo"];
  const categoryData = createSelectGroup("Cargo", "categoryID", taskCategory);
  const categoryValue =
    taskToEdit?.category ?? taskToEdit?.getTaskCategory?.()?.name ?? "";
  if (categoryValue) {
    categoryData.select.value = categoryValue;
  }

  const taskType = ["Bugs", "Feature", "Task"];
  const TypeData = createSelectGroup("Tipo", "typeID", taskType);
  const typeValue = taskToEdit?.type ?? taskToEdit?.getType?.() ?? "";
  if (typeValue) {
    TypeData.select.value = typeValue;
  }

  const submitBtn = createButton(
    "button",
    taskToEdit ? "Atualizar" : "Adicionar",
    "submit",
  ) as HTMLButtonElement;

  form.append(
    titleData.section,
    categoryData.section,
    TypeData.section,
    submitBtn,
  );
  content.append(closeBtn, titleHeading, form);
  modal.append(content);
  document.body.appendChild(modal);

  // Ligar a lógica ao formulário
  setupTaskFormLogic(
    form,
    {
      title: titleData.input,
      category: categoryData.select,
      type: TypeData.select,
    },
    {
      titleErr: titleData.errorSection,
      categoryErr: categoryData.errorSection,
      typeErr: TypeData.errorSection,
    },
    modal,
    projectId,
    taskToEdit,
    user,
    onSuccess,
  );

  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.style.display = "block";
}
