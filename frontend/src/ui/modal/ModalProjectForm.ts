import { IProject, Project } from "../../projects/index.js";
import { ProjectStatus } from "../../projects/ProjectStatus.js";
import { GlobalValidators } from "../../utils/index.js";
import { ProjectService } from "../../services/index.js";
import { loadProjectsPage } from "../projects/ProjectPageUI.js";

import {
  createButton,
  createForm,
  createHeadingTitle,
  createInputGroup,
  createSection,
  createSelectGroup,
} from "../dom/index.js";
import { showInfoBanner } from "../../helpers/index.js";

function setupProjectFormLogic(
  form: HTMLFormElement,
  fields: {
    name: HTMLInputElement;
    description: HTMLInputElement;
    startDate: HTMLInputElement;
    endDate: HTMLInputElement;
    status: HTMLSelectElement;
  },
  errors: {
    nameErr: HTMLElement;
    descriptionErr: HTMLElement;
    startDateErr: HTMLElement;
    endDateErr: HTMLElement;
    statusErr: HTMLElement;
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
    const status: string = fields.status.value;

    // Reset de estados de erro
    errors.nameErr.textContent = "";
    errors.descriptionErr.textContent = "";
    errors.startDateErr.textContent = "";
    errors.endDateErr.textContent = "";
    errors.statusErr.textContent = "";

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

    if (!GlobalValidators.isNonEmpty(status)) {
      errors.statusErr.textContent =
        "O estado do projeto não pode estar vazio.";
      isValid = false;
    }

    // Verificação Final
    if (isValid) {
      let projectStatus: ProjectStatus = ProjectStatus.ACTIVE;

      // Obter o estado do projeto
      if (status === "Ativo") {
        projectStatus = ProjectStatus.ACTIVE;
      } else if (status === "Em Desenvolvimento") {
        projectStatus = ProjectStatus.IN_DEVELOPMENT;
      } else if (status === "Terminado") {
        projectStatus = ProjectStatus.FINISHED;
      }

      // Criar objeto do projeto (ID 0 será gerado pela base de dados)
      const newProjectData = new Project(
        0, // ID placeholder - será gerado pelo backend
        name.trim(),
        description || "",
        1, // projectStatusId
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
export function renderProjectModal(): void {
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

  const descriptionData = createInputGroup(
    "Descrição",
    "projectDescriptionInput",
    "text",
    "inserir a descrição do projeto (opcional)",
  );

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

  const projectStates = ["Ativo", "Em Desenvolvimento", "Terminado"];
  const statusData = createSelectGroup("Estado", "statusID", projectStates);

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
    statusData.section,
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
      status: statusData.select,
    },
    {
      nameErr: nameData.errorSection,
      descriptionErr: descriptionData.errorSection,
      startDateErr: startDateData.errorSection,
      endDateErr: endDateData.errorSection,
      statusErr: statusData.errorSection,
    },
    modal,
  );
}
