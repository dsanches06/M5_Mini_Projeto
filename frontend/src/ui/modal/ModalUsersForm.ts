import {
  createButton,
  createForm,
  createSection,
  createHeadingTitle,
  createInputGroup,
  createSelectGroup,
} from "../dom/index.js";
import { UserService } from "../../services/index.js";
import { IUser, UserClass } from "../../models/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { renderUsers, showUsersCounters } from "../users/index.js";
import { GlobalValidators, IdGenerator } from "../../utils/index.js";
import { UserRole } from "../../security/UserRole.js";

/**
 * Gere a submissão e validação com Regex para Email
 */
function setupFormLogic(
  form: HTMLFormElement,
  fields: {
    name: HTMLInputElement;
    email: HTMLInputElement;
    gender: HTMLSelectElement;
    role: HTMLSelectElement;
  },
  errors: {
    nameErr: HTMLElement;
    emailErr: HTMLElement;
    genderErr: HTMLElement;
    roleErr: HTMLElement;
  },
  modal: HTMLElement,
): void {
  form.onsubmit = (e: Event) => {
    e.preventDefault();

    //obter os resultados
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const gender = fields.gender.value.trim();
    const role = fields.role.value.trim();

    // Reset de estados
    errors.nameErr.textContent = "";
    errors.emailErr.textContent = "";
    errors.genderErr.textContent = "";
    errors.roleErr.textContent = "";

    let isValid = true;

    // Validação do Nome
    if (!GlobalValidators.minLength(name, 3)) {
      errors.nameErr.textContent = "O nome deve ter pelo menos 3 caracteres.";
      isValid = false;
    }

    // Validação do Nome
    if (!GlobalValidators.isNonEmpty(name)) {
      errors.nameErr.textContent = "O nome não pode estar vazio.";
      isValid = false;
    }

    // Validação do Genero
    if (!GlobalValidators.isNonEmpty(gender)) {
      errors.genderErr.textContent = "O género não pode estar vazio.";
      isValid = false;
    }

    //  Validação de Email com Regex
    if (!GlobalValidators.isValidEmail(email)) {
      errors.emailErr.textContent =
        "Introduza um endereço de email válido (ex: nome@email.com).";
      isValid = false;
    }

    if (!GlobalValidators.isNonEmpty(role)) {
      errors.roleErr.textContent = "O role não pode estar vazio.";
      isValid = false;
    }

    // // Validar se já existe utilizador com o mesmo nome
    // const existingUserByName = UserService.getAllUsers().find(
    //   (user) => user.getName().toLowerCase() === name.toLowerCase(),
    // );
    // if (existingUserByName) {
    //   errors.nameErr.textContent = `Já existe um utilizador com o nome "${name}".`;
    //   isValid = false;
    // }

    // Validar se já existe utilizador com o mesmo email
    const existingUserByEmail = UserService.getAllUsers().find(
      (user) => user.getEmail().toLowerCase() === email.toLowerCase(),
    );
    if (existingUserByEmail) {
      errors.emailErr.textContent = `Já existe um utilizador com o email "${email}".`;
      isValid = false;
    }

    let roleUser: UserRole | undefined;

    // Verificação Final
    if (isValid && roleUser === undefined) {
      //obter um novo id sequencial global
      let newId: number = IdGenerator.generateUserId();
      //cria um novo user com os dados inseridos no formulario

      if (role === "ADMIN") {
        roleUser = UserRole.ADMIN;
      } else if (role === "MANAGER") {
        roleUser = UserRole.MANAGER;
      } else if (role === "MEMBER") {
        roleUser = UserRole.MEMBER;
      } else if (role === "VIEWER") {
        roleUser = UserRole.VIEWER;
      }

      if (roleUser) {
        const user: IUser = new UserClass(newId, name, email, gender, roleUser);
        //adiciona a lista de utilizadores
        UserService.addUser(user);
        //mensagem de sucesso ou erro
        if (user && user.getName()) {
          showInfoBanner(
            `${user.getName()} foi adicionado com sucesso.`,
            "info-banner",
          );
        } else {
          showInfoBanner(
            `ERRO: ${fields.name.value} não foi adicionado.`,
            "error-banner",
          );
        }
        //mostra todos os utilizadores
        renderUsers(UserService.getAllUsers() as UserClass[]);
        // atualizar contadores
        showUsersCounters(
          UserService.getAllUsers() as UserClass[],
          "utilizadores",
        );
        modal.remove();
      }
    } else {
      showInfoBanner(
        `O utilizador não foi adicionado. Verifique os erros no formulário.`,
        "error-banner",
      );
    }
  };
}

/**
 *  Função Principal: Monta o Modal no DOM
 */
export function renderUserModal(): void {
  const modal = createSection("modalUserForm") as HTMLElement;
  modal.classList.add("modal");

  const content = createSection("modalUserContent") as HTMLElement;
  content.classList.add("modal-content");

  const closeBtn = document.createElement("span") as HTMLSpanElement;
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const title = createHeadingTitle(
    "h2",
    "Adicionar Utilizador",
  ) as HTMLHeadingElement;

  const form = createForm("formUser") as HTMLFormElement;

  // Criação dos campos usando a função auxiliar
  const nameData = createInputGroup(
    "Nome",
    "nameInput",
    "text",
    "inserir o nome",
  );
  const emailData = createInputGroup(
    "Email",
    "emailInput",
    "email",
    "inserir o email",
  );
  const selectGenderData = createSelectGroup("Gender", "selectGender", [
    "Masculino",
    "Feminino",
  ]);
  const selectRoleData = createSelectGroup("Role", "selectRole", [
    "ADMIN",
    "MANAGER",
    "MEMBER",
    "VIEWER",
  ]);

  // Container para colocar lado a lado
  const selectsContainer = document.createElement("div");
  selectsContainer.style.display = "flex";
  selectsContainer.style.gap = "6rem";
  selectsContainer.append(selectGenderData.section, selectRoleData.section);
 
  const submitBtn = createButton(
    "button",
    "Adicionar",
    "submit",
  ) as HTMLButtonElement;

  form.append(
    nameData.section,
    emailData.section,
    selectsContainer,
    submitBtn,
  );
  content.append(closeBtn, title, form);
  modal.append(content);
  document.body.appendChild(modal);

  // Ligar a lógica ao formulário
  setupFormLogic(
    form,
    {
      name: nameData.input,
      email: emailData.input,
      gender: selectGenderData.select,
      role: selectRoleData.select,
    },
    {
      nameErr: nameData.errorSection,
      emailErr: emailData.errorSection,
      genderErr: selectGenderData.errorSection,
      roleErr: selectRoleData.errorSection,
    },
    modal,
  );

  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.style.display = "block";
}
