import { IUser } from "../../models/index.js";
import { GlobalValidators } from "../../utils/index.js";

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
      showInfoBanner(
        `INFO: A tarefa "${title}" foi criada com sucesso.`,
        "success-banner",
      );
      modal.remove();
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
