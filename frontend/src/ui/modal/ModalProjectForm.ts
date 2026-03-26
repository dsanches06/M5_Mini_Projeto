import { Project } from "../../projects/index.js";
import { GlobalValidators } from "../../utils/index.js";
import { ProjectService } from "../../services/index.js";
import { loadProjectsPage } from "../projects/ProjectPageUI.js";

import {
  createButton,
  createForm,
  createHeadingTitle,
  createInputGroup,
  createSection,
} from "../dom/index.js";
import { showInfoBanner } from "../../helpers/index.js";

function setupProjectFormLogic(
  form: HTMLFormElement,
  fields: {
    name: HTMLInputElement;
    description: HTMLTextAreaElement;
    startDate: HTMLInputElement;
    endDate: HTMLInputElement;
  },
  errors: {
    nameErr: HTMLElement;
    descriptionErr: HTMLElement;
    startDateErr: HTMLElement;
    endDateErr: HTMLElement;
  },
  modal: HTMLElement,
): void {
  form.onsubmit = async (e: Event) => {
    e.preventDefault();

    // Obter os valores dos campos
    const name: string = fields.name.value;
    const description: string = fields.description.value;
    const startDate: string = fields.startDate.value;
    const endDate: string = fields.endDate.value;

    // Reset de estados de erro
    errors.nameErr.textContent = "";
    errors.descriptionErr.textContent = "";
    errors.startDateErr.textContent = "";
    errors.endDateErr.textContent = "";

    let isValid = true;

    // Validações
    if (!GlobalValidators.isNonEmpty(name.trim())) {
      errors.nameErr.textContent = "O nome do projeto não pode estar vazio.";
      isValid = false;
    }

    if (!GlobalValidators.minLength(name.trim(), 3)) {
      errors.nameErr.textContent =
        "O nome do projeto deve ter pelo menos 3 caracteres.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(startDate)) {
      errors.startDateErr.textContent = "A data de início é obrigatória.";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(endDate)) {
      errors.endDateErr.textContent = "A data de fim esperada é obrigatória.";
      isValid = false;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        errors.endDateErr.textContent =
          "A data de fim deve ser depois da data de início.";
        isValid = false;
      }
    }

    // Verificação Final
    if (isValid) {
      // o estado inicial do projeto será sempre "Ativo" (ID 1) ao ser criado
      const projectStatusId = 1;

      // Criar objeto do projeto (ID 0 será gerado pela base de dados)
      const newProjectData = new Project(
        0, // ID placeholder - será gerado pelo backend
        name.trim(),
        description || "",
        projectStatusId, // Usar o ID do status selecionado
        new Date(startDate),
        new Date(endDate),
      );

      try {
        // Criar projeto via serviço (envia para a API)
        await ProjectService.createProject(newProjectData);

        // Obter todos os projetos e renderizar
        const projects = await ProjectService.getProjects();
        loadProjectsPage(projects);

        showInfoBanner(
          `INFO: O projeto ${name} foi criado com sucesso.`,
          "info-banner",
        );

        modal.remove();
      } catch (error) {
        showInfoBanner(
          `ERRO: Não foi possível criar o projeto ${name}.`,
          "error-banner",
        );
        console.error("Erro ao criar projeto:", error);
      }
    } else {
      showInfoBanner(
        `ERRO: O projeto não foi criado. Verifique os erros no formulário.`,
        "error-banner",
      );
    }
  };
}

/**
 * Função Principal: Monta o Modal no DOM
 */
export async function renderProjectModal(): Promise<void> {
  const modal = createSection("modalProjectForm") as HTMLElement;
  modal.classList.add("modal");

  const content = createSection("modalProjectContent") as HTMLElement;
  content.classList.add("modal-content");

  const closeBtn = document.createElement("span") as HTMLSpanElement;
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const titleHeading = createHeadingTitle(
    "h2",
    "Adicionar Projeto",
  ) as HTMLHeadingElement;

  const form = createForm("formProject") as HTMLFormElement;

  // Criação dos campos usando a função auxiliar
  const nameData = createInputGroup(
    "Nome do Projeto",
    "projectNameInput",
    "text",
    "inserir o nome do projeto",
  );

  // Criar descrição como textarea com 4 linhas
  const descriptionGroup = document.createElement("section");
  descriptionGroup.className = "form-group";

  const descriptionLabel = document.createElement("label");
  descriptionLabel.htmlFor = "projectDescriptionInput";
  descriptionLabel.textContent = "Descrição";

  const descriptionTextarea = document.createElement(
    "textarea",
  ) as HTMLTextAreaElement;
  descriptionTextarea.id = "projectDescriptionInput";
  descriptionTextarea.rows = 4;
  descriptionTextarea.placeholder = "inserir a descrição do projeto (opcional)";

  descriptionGroup.append(descriptionLabel, descriptionTextarea);

  const descriptionData = {
    section: descriptionGroup,
    input: descriptionTextarea,
    errorSection: document.createElement("section"),
  };
  descriptionData.errorSection.id = "projectDescriptionInputError";
  descriptionData.errorSection.className = "error-message";
  descriptionGroup.append(descriptionData.errorSection);

  const startDateData = createInputGroup(
    "Data de Início",
    "projectStartDateInput",
    "date",
    "selecionar data de início",
  );

  const endDateData = createInputGroup(
    "Data de Fim Esperada",
    "projectEndDateInput",
    "date",
    "selecionar data de fim",
  );

  const submitBtn = createButton(
    "button",
    "Criar Projeto",
    "submit",
  ) as HTMLButtonElement;

  form.append(
    nameData.section,
    descriptionData.section,
    startDateData.section,
    endDateData.section,
    submitBtn,
  );

  content.append(closeBtn, titleHeading, form);
  modal.append(content);
  document.body.appendChild(modal);

  // Ligar a lógica ao formulário
  setupProjectFormLogic(
    form,
    {
      name: nameData.input,
      description: descriptionData.input,
      startDate: startDateData.input,
      endDate: endDateData.input,
    },
    {
      nameErr: nameData.errorSection,
      descriptionErr: descriptionData.errorSection,
      startDateErr: startDateData.errorSection,
      endDateErr: endDateData.errorSection,
    },
    modal,
  );

  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.style.display = "block";
}
