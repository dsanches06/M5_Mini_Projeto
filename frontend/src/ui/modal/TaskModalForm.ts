import { ITask, BugTask, FeatureTask, Task } from "../../tasks/index.js";
import { TaskCategory } from "../../tasks/TaskCategory.js";
import { IUser } from "../../models/index.js";
import { GlobalValidators, IdGenerator } from "../../utils/index.js";
import { renderDashboard, showTasksCounters } from "../tasks/index.js";
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
  user?: IUser,
): void {
  form.onsubmit = (e: Event) => {
    e.preventDefault();

    //obter os valores dos campos
    const title: string = fields.title.value;
    const category: string = fields.category.value;
    const type: string = fields.type.value;

    // Reset de estados
    errors.titleErr.textContent = "";
    errors.categoryErr.textContent = "";
    errors.typeErr.textContent = "";

    let isValid = true;

    if (!GlobalValidators.minLength(title.trim(), 3)) {
      errors.titleErr.textContent =
        "O titulo deve ter pelo menos 3 caracteres.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(title.trim())) {
      errors.titleErr.textContent = "O titulo não pode estar vazio.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(category.trim())) {
      errors.categoryErr.textContent = "A categoria não pode estar vazio.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(type.trim())) {
      errors.typeErr.textContent = "O tipo não pode estar vazio.";
      isValid = false;
    }
    let newTask: ITask | undefined;
    let taskCategory: TaskCategory = TaskCategory.PERSONAL;
    // Verificação Final
    if (isValid) {
      //obter a cetagoria
      if (category) {
        if (category === "Trabalho") {
          taskCategory = TaskCategory.WORKED;
        } else if (category === "Pessoal") {
          taskCategory = TaskCategory.PERSONAL;
        } else if (category === "Estudo") {
          taskCategory = TaskCategory.STUDY;
        }
      }
      //obter um novo id sequencial global
      let newId: number = IdGenerator.generateTaskId();
      //obter o tipo de task a criar
      if (type.trim() === "Bugs") {
        newTask = new BugTask(newId, title, undefined, taskCategory);
      } else if (type.trim() === "Feature") {
        newTask = new FeatureTask(newId, title, undefined, taskCategory);
      } else if (type.trim() === "Task") {
        newTask = new Task(newId, title, undefined, taskCategory);
      }

      if (newTask) {
        if (user) {
          user.createTask(newTask);
          TaskService.addTask(newTask);
          renderDashboard(TaskService.getAllTasks(), user);
          showInfoBanner(
            `INFO: A tarefa ${newTask.getTitle()} foi criado ao utilizador ${user.getName()} com sucesso.`,
            "info-banner",
          );
        } else {
          TaskService.addTask(newTask);
          renderDashboard(TaskService.getAllTasks());
          showInfoBanner(
            `INFO: A tarefa ${newTask.getTitle()} foi criado com sucesso.`,
            "info-banner",
          );
        }
      } else {
        showInfoBanner(
          `ERRO: A tarefa ${title} não foi criado.`,
          "error-banner",
        );
      }
      modal.remove();
    } else {
      showInfoBanner(
        `ERRO: A tarefa ${title} não foi criado. Verifique os erros no formulário.`,
        "error-banner",
      );
    }
  };
}

/**
 *  Função Principal: Monta o Modal no DOM
 */
export function renderTaskModal(user?: IUser): void {
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
    "Adicionar Tarefa",
  ) as HTMLHeadingElement;

  const form = createForm("formTask") as HTMLFormElement;

  // Criação dos campos usando a função auxiliar
  const titleData = createInputGroup(
    "Titulo",
    "taskTitleInput",
    "text",
    "inserir o titulo da tarefa",
  );
  const taskCategory = ["Trabalho", "Pessoal", "Estudo"];
  const categoryData = createSelectGroup("Cargo", "categoryID", taskCategory);

  const taskType = ["Bugs", "Feature", "Task"];
  const TypeData = createSelectGroup("Tipo", "typeID", taskType);

  const submitBtn = createButton(
    "button",
    "Adicionar",
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
    user,
  );

  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.style.display = "block";
}
