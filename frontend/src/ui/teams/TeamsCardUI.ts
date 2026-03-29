import { addElementInContainer, clearContainer } from "../dom/index.js";
import {
  UserService,
  TeamMemberService,
  TaskAssigneeService,
  TeamService,
} from "../../services/index.js";
import { IUser } from "../../models/index.js";
import { renderTeamModal } from "../modal/index.js";
import { getAvatarPath, showConfirmDialog, showInfoBanner } from "../../helpers/index.js";

/* Renderiza as equipes em cards na Grid principal */
export async function renderTeamsCards(teams: any[]): Promise<void> {
  let gridContainer = document.querySelector(
    "#teamsGridContainer",
  ) as HTMLElement;

  if (!gridContainer) {
    gridContainer = document.createElement("div");
    gridContainer.id = "teamsGridContainer";
    gridContainer.className = "teams-grid-container";
    addElementInContainer("#containerSection", gridContainer);
  }

  gridContainer.innerHTML = "";

  for (const team of teams) {
    const card = await createTeamCard(team);
    card.style.cursor = "pointer";

    gridContainer.appendChild(card);
  }
}

/* Cria a estrutura individual de cada card de equipe */
async function createTeamCard(team: any): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "team-card";

  const cardContent = document.createElement("div");
  cardContent.className = "team-card-content";

  const mainSection = document.createElement("div");
  mainSection.className = "team-card-main";

  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("h3");
  title.textContent = team.name || "Equipe sem nome";

  const actions = document.createElement("div");
  actions.className = "team-card-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "icon-button";
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.title = "Editar equipe";
  editBtn.setAttribute("aria-label", "Editar equipe");
  editBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTeamModal(team);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-button";
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.title = "Excluir equipe";
  deleteBtn.setAttribute("aria-label", "Excluir equipe");
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (
      await showConfirmDialog(
        `Tem certeza que deseja excluir a equipe "${team.name}"?`,
      )
    ) {
      try {
        await TeamService.deleteTeam(team.id);
        showInfoBanner(
          `Equipe "${team.name}" removida com sucesso.`,
          "success-banner",
        );
        const currentTeams = await TeamService.getTeams();
        await renderTeamsCards(currentTeams);
      } catch (error) {
        showInfoBanner(`Erro ao excluir equipe: ${error}`, "error-banner");
      }
    }
  });

  const addTeamMemberBtn = document.createElement("button");
  addTeamMemberBtn.className = "icon-button";
  addTeamMemberBtn.innerHTML = `<i class="fas fa-user-plus"></i>`;
  addTeamMemberBtn.title = "Adicionar membro";
  addTeamMemberBtn.setAttribute("aria-label", "Adicionar membro");
  addTeamMemberBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTeamDetailsModal(team);
  });

  const deleteTeamMemberBtn = document.createElement("button");
  deleteTeamMemberBtn.className = "icon-button";
  deleteTeamMemberBtn.innerHTML = `<i class="fas fa-user-minus"></i>`;
  deleteTeamMemberBtn.title = "Remover membro";
  deleteTeamMemberBtn.setAttribute("aria-label", "Remover membro");
  deleteTeamMemberBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTeamDetailsModal(team);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  actions.appendChild(addTeamMemberBtn);
  actions.appendChild(deleteTeamMemberBtn);
  header.appendChild(title);
  mainSection.appendChild(header);

  const desc = document.createElement("p");
  desc.className = "team-desc";
  desc.textContent = team.description || "Sem descrição disponível";

  const infoContainer = document.createElement("div");
  infoContainer.className = "team-info";

  const createdDate = document.createElement("span");
  createdDate.className = "created-date";
  const dateValue = team.createdAt || team.created_at || new Date();
  createdDate.textContent = `Criada: ${new Date(dateValue).toLocaleDateString("pt-BR")}`;

  const memberCount = document.createElement("span");
  memberCount.className = "member-count";

  infoContainer.appendChild(createdDate);
  infoContainer.appendChild(memberCount);

  const footer = document.createElement("div");
  footer.className = "team-card-footer";

  const avatarStack = document.createElement("div");
  avatarStack.className = "avatar-stack";

  try {
    const allTeamMembers = await TeamMemberService.getTeamMembers();
    const teamMembers = allTeamMembers.filter(
      (member: any) => member.team_id === team.id,
    );

    memberCount.textContent = `Membros: ${teamMembers.length}`;

    if (teamMembers.length > 0) {
      const allUsers = await UserService.getUsers();
      const userMap = new Map<number, IUser>();
      allUsers.forEach((user: IUser) => {
        userMap.set(user.getId(), user);
      });

      const members: Array<{ userId: number; gender: string; user: IUser }> =
        [];
      teamMembers.forEach((member: any) => {
        const user = userMap.get(member.user_id);
        if (user) {
          members.push({
            userId: member.user_id,
            gender: (user as any).getGender?.() || "Male",
            user,
          });
        }
      });

      const displayLimit = 4;
      members.slice(0, displayLimit).forEach((member, index) => {
        const img = document.createElement("img");
        img.className = "avatar-img";

        const randomValue = (index % 4) + 1;
        img.src = getAvatarPath(member.userId, member.gender, randomValue);
        img.alt = member.user.getName();
        img.title = member.user.getName();

        avatarStack.appendChild(img);
      });

      if (members.length > displayLimit) {
        const more = document.createElement("span");
        more.className = "avatar-more";
        more.textContent = `+${members.length - displayLimit}`;
        avatarStack.appendChild(more);
      }
    }
  } catch (error) {
    console.error("Erro ao carregar membros da equipe:", error);
    memberCount.textContent = `Membros: 0`;
  }

  footer.appendChild(avatarStack);

  mainSection.appendChild(desc);
  mainSection.appendChild(infoContainer);
  mainSection.appendChild(footer);
  cardContent.appendChild(mainSection);
  cardContent.appendChild(actions);
  card.appendChild(cardContent);

  return card;
}

async function renderTeamDetailsModal(team: any): Promise<void> {
  const modal = document.createElement("section") as HTMLElement;
  modal.className = "modal";
  modal.id = "modalTeamDetails";

  const content = document.createElement("div");
  content.className = "modal-content";
  content.style.maxWidth = "700px";
  content.style.padding = "1.5rem";
  content.style.position = "relative";

  const closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.innerHTML = "&times;";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "1rem";
  closeBtn.style.right = "1rem";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "1.5rem";
  closeBtn.onclick = () => modal.remove();

  const title = document.createElement("h2");
  title.textContent = team.name || "Equipe";
  title.style.marginTop = "0";

  const description = document.createElement("p");
  description.textContent = team.description || "Sem descrição disponível.";
  description.style.color = "#555";

  const createdDate = document.createElement("p");
  const dateValue = team.createdAt || team.created_at || new Date();
  createdDate.textContent = `Criada em: ${new Date(dateValue).toLocaleDateString("pt-BR")}`;
  createdDate.style.color = "#777";
  createdDate.style.marginTop = "0.25rem";

  const membersSection = document.createElement("div");
  membersSection.style.marginTop = "1rem";

  const membersHeader = document.createElement("div");
  membersHeader.style.display = "flex";
  membersHeader.style.justifyContent = "space-between";
  membersHeader.style.alignItems = "center";

  const membersTitle = document.createElement("h3");
  membersTitle.textContent = "Membros da equipe";
  membersTitle.style.margin = "0";

  const addMemberBtn = document.createElement("button");
  addMemberBtn.textContent = "+ Adicionar membro";
  addMemberBtn.style.padding = "0.4rem 0.9rem";
  addMemberBtn.style.border = "none";
  addMemberBtn.style.borderRadius = "4px";
  addMemberBtn.style.cursor = "pointer";
  addMemberBtn.style.backgroundColor = "#4CAF50";
  addMemberBtn.style.color = "white";
  addMemberBtn.style.fontSize = "0.85rem";

  membersHeader.appendChild(membersTitle);
  membersHeader.appendChild(addMemberBtn);

  membersSection.appendChild(membersHeader);

  const membersList = document.createElement("div");
  membersList.style.display = "grid";
  membersList.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(180px, 1fr))";
  membersList.style.gap = "0.75rem";
  membersList.style.marginTop = "0.75rem";

  membersSection.appendChild(membersList);

  const candidatesSection = document.createElement("div");
  candidatesSection.style.marginTop = "1rem";

  const candidateLabel = document.createElement("label");
  candidateLabel.textContent = "Usuários com tarefas atribuídas";
  candidateLabel.style.display = "block";
  candidateLabel.style.marginBottom = "0.5rem";
  candidatesSection.appendChild(candidateLabel);

  const candidateSelect = document.createElement("select") as HTMLSelectElement;
  candidateSelect.style.width = "100%";
  candidateSelect.style.padding = "0.6rem";
  candidateSelect.style.border = "1px solid #ccc";
  candidateSelect.style.borderRadius = "4px";

  candidatesSection.appendChild(candidateSelect);

  const addMemberConfirm = document.createElement("button");
  addMemberConfirm.textContent = "Adicionar membro à equipe";
  addMemberConfirm.style.marginTop = "0.75rem";
  addMemberConfirm.style.padding = "0.6rem 1rem";
  addMemberConfirm.style.border = "none";
  addMemberConfirm.style.borderRadius = "4px";
  addMemberConfirm.style.cursor = "pointer";
  addMemberConfirm.style.backgroundColor = "#0077CC";
  addMemberConfirm.style.color = "white";
  addMemberConfirm.disabled = true;

  candidatesSection.appendChild(addMemberConfirm);

  const reloadTeamDetails = async () => {
    membersList.innerHTML = "";
    candidateSelect.innerHTML = "";
    addMemberConfirm.disabled = true;

    try {
      const allTeamMembers = await TeamMemberService.getTeamMembers();
      const teamMembers = allTeamMembers.filter(
        (member: any) => member.team_id === team.id,
      );
      const memberIds = new Set(
        teamMembers.map((member: any) => member.user_id),
      );

      const allUsers = await UserService.getUsers();
      const allAssignees = await TaskAssigneeService.getTaskAssignees();
      const assigneeUserIds = new Set(
        allAssignees.map((assignee) => assignee.user_id),
      );

      const memberUsers = allUsers.filter((user: IUser) =>
        memberIds.has(user.getId()),
      );
      if (memberUsers.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Nenhum membro cadastrado nesta equipe.";
        empty.style.color = "#777";
        membersList.appendChild(empty);
      } else {
        memberUsers.forEach((user) => {
          const memberCard = document.createElement("div");
          memberCard.style.backgroundColor = "#f5f5f5";
          memberCard.style.border = "1px solid #ddd";
          memberCard.style.borderRadius = "4px";
          memberCard.style.padding = "0.75rem";

          const memberName = document.createElement("strong");
          memberName.textContent = user.getName();
          memberName.style.display = "block";
          memberName.style.marginBottom = "0.25rem";

          const memberEmail = document.createElement("span");
          memberEmail.textContent =
            (user as any).getEmail?.() || "Email indisponível";
          memberEmail.style.color = "#555";
          memberEmail.style.fontSize = "0.9rem";

          memberCard.appendChild(memberName);
          memberCard.appendChild(memberEmail);
          membersList.appendChild(memberCard);
        });
      }

      const candidateUsers = allUsers.filter(
        (user: IUser) =>
          assigneeUserIds.has(user.getId()) && !memberIds.has(user.getId()),
      );

      if (candidateUsers.length === 0) {
        const option = document.createElement("option");
        option.textContent = "Nenhum usuário elegível encontrado";
        option.value = "";
        candidateSelect.appendChild(option);
        candidateSelect.disabled = true;
      } else {
        const placeholder = document.createElement("option");
        placeholder.textContent = "Selecione um usuário...";
        placeholder.value = "";
        candidateSelect.appendChild(placeholder);
        candidateSelect.disabled = false;

        candidateUsers.forEach((user: IUser) => {
          const option = document.createElement("option");
          option.value = String(user.getId());
          option.textContent = user.getName();
          candidateSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Erro ao recarregar dados de equipe:", error);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Erro ao carregar membros ou candidatos.";
      errorMsg.style.color = "#e74c3c";
      membersList.appendChild(errorMsg);
    }
  };

  candidateSelect.addEventListener("change", () => {
    addMemberConfirm.disabled = candidateSelect.value === "";
  });

  addMemberConfirm.addEventListener("click", async () => {
    const selectedUserId = Number(candidateSelect.value);
    if (!selectedUserId) return;

    try {
      await TeamMemberService.createTeamMember({
        team_id: team.id,
        user_id: selectedUserId,
      });
      showInfoBanner(
        "Membro adicionado à equipe com sucesso.",
        "success-banner",
      );
      await reloadTeamDetails();
    } catch (error) {
      console.error("Erro ao adicionar membro de equipe:", error);
      showInfoBanner("Erro ao adicionar membro de equipe.", "error-banner");
    }
  });

  addMemberBtn.addEventListener("click", () => {
    candidateSelect.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  content.appendChild(closeBtn);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(createdDate);
  content.appendChild(membersSection);
  content.appendChild(candidatesSection);
  modal.appendChild(content);
  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.remove();
  });

  await reloadTeamDetails();
}
