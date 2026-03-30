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
    await renderTeamMemberModal(team, "add");
  });

  const deleteTeamMemberBtn = document.createElement("button");
  deleteTeamMemberBtn.className = "icon-button";
  deleteTeamMemberBtn.innerHTML = `<i class="fas fa-user-minus"></i>`;
  deleteTeamMemberBtn.title = "Remover membro";
  deleteTeamMemberBtn.setAttribute("aria-label", "Remover membro");
  deleteTeamMemberBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTeamMemberModal(team, "remove");
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

async function renderTeamMemberModal(
  team: any,
  action: "add" | "remove",
): Promise<void> {
  try {
    const teamId = team.id;
    const allUsers = await UserService.getUsers();
    const allAssignees = await TaskAssigneeService.getTaskAssignees();
    const assigneeUserIds = new Set(
      allAssignees.map((assignee) => assignee.user_id),
    );

    const allTeamMembers = await TeamMemberService.getTeamMembers();
    const teamMembers = allTeamMembers.filter(
      (member: any) => member.team_id === teamId,
    );
    const memberIds = new Set(
      teamMembers.map((member: any) => member.user_id),
    );

    const availableUsers =
      action === "add"
        ? allUsers.filter((user: IUser) => !memberIds.has(user.getId()))
        : allUsers.filter((user: IUser) => memberIds.has(user.getId()));

    const modal = document.createElement("section");
    modal.className = "modal team-member-selection-modal";
    modal.id = `teamMemberModal-${teamId}-${action}`;

    const content = document.createElement("div");
    content.className = "modal-content";
    content.style.maxWidth = "1040px";
    content.style.width = "95%";
    content.style.padding = "42px";

    const title = document.createElement("h2");
    title.textContent =
      action === "add" ? "Selecionar usuário para adicionar à equipe" : "Selecionar usuário para remover da equipe";

    const list = document.createElement("div");
    list.className = "team-member-selection-list";
    list.style.display = "grid";
    list.style.gridTemplateColumns = "repeat(3, minmax(260px, 1fr))";
    list.style.gap = "1rem";
    list.style.marginTop = "1rem";

    availableUsers.forEach((user: IUser) => {
      const row = document.createElement("div");
      row.className = "team-member-selection-row";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "0.8rem 1rem";
      row.style.background = "#f7f7f7";
      row.style.border = "1px solid rgba(0,0,0,0.08)";
      row.style.borderRadius = "8px";

      const label = document.createElement("span");
      label.textContent = user.getName();
      label.style.fontSize = "0.95rem";
      label.style.color = "#1f2937";
      label.style.flex = "1";

      const button = document.createElement("button");
      button.className = "btn primary";
      button.innerHTML =
        action === "add"
          ? `<i class="fas fa-plus"></i>`
          : `<i class="fas fa-minus"></i>`;
      button.title = action === "add" ? "Adicionar membro" : "Remover membro";
      button.setAttribute(
        "aria-label",
        action === "add" ? "Adicionar membro" : "Remover membro",
      );
      button.style.marginLeft = "0";
      button.style.padding = "0";
      button.style.width = "34px";
      button.style.height = "34px";
      button.style.display = "inline-flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.fontSize = "1rem";
      button.style.minWidth = "auto";
      button.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          if (action === "add") {
            await TeamMemberService.createTeamMember({
              team_id: teamId,
              user_id: user.getId(),
            });
            showInfoBanner(`Usuário "${user.getName()}" adicionado à equipe.`, "success");
          } else {
            const teamMember = teamMembers.find(
              (m: any) => m.user_id === user.getId(),
            );
            if (teamMember && teamMember.id) {
              await TeamMemberService.deleteTeamMember(teamMember.id);
              showInfoBanner(`Usuário "${user.getName()}" removido da equipe.`, "success");
            }
          }
          modal.remove();
          window.location.reload();
        } catch (error) {
          showInfoBanner("Erro ao atualizar membro da equipe.", "error");
          console.error("Erro ao atualizar membro da equipe:", error);
        }
      });

      row.append(label, button);
      list.appendChild(row);
    });

    content.append(title, list);
    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.style.display = "block";

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  } catch (error) {
    showInfoBanner("Erro ao abrir o modal de membros.", "error");
    console.error("Erro ao renderizar modal de membros:", error);
  }
}
