import { addElementInContainer, clearContainer } from "../dom/index.js";
import { UserService, TeamMemberService } from "../../services/index.js";
import { IUser } from "../../models/index.js";

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

  // HEADER (Título)
  const header = document.createElement("div");
  header.className = "card-header";
  const title = document.createElement("h3");
  title.textContent = team.name || "Equipe sem nome";
  header.appendChild(title);

  // DESCRIPTION
  const desc = document.createElement("p");
  desc.className = "team-desc";
  desc.textContent = team.description || "Sem descrição disponível";

  // INFO (Container Flex)
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
    // Buscar TODOS os team members da API
    const allTeamMembers = await TeamMemberService.getTeamMembers();
    
    // Filtrar membros da equipe atual
    const teamMembers = allTeamMembers.filter(
      (member: any) => member.team_id === team.id
    );

    // Se não há membros, mostrar 0
    memberCount.textContent = `Membros: ${teamMembers.length}`;

    if (teamMembers.length > 0) {
      // Buscar todos os users para pegar género e nome
      const allUsers = await UserService.getUsers();
      const userMap = new Map<number, IUser>();
      allUsers.forEach((user: IUser) => {
        userMap.set(user.getId(), user);
      });

      // Construir array de membros com dados dos users
      const members: Array<{ userId: number; gender: string; user: IUser }> = [];

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

      // Renderizar avatares (máximo 4)
      const displayLimit = 4;
      members.slice(0, displayLimit).forEach((member, index) => {
        const img = document.createElement("img");
        img.className = "avatar-img";

        // Selecionar pasta baseado no gender
        const folder = member.gender === "Female" ? "woman" : "man";
        const randomValue = (index % 4) + 1; // 1-4
        img.src = `./src/assets/${folder}-${randomValue}.png`;
        img.alt = member.user.getName();
        img.title = member.user.getName();

        avatarStack.appendChild(img);
      });

      // Mostrar "+X" se houver mais membros
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

  // Adicionar ao card na ordem correta
  card.appendChild(header);
  card.appendChild(desc);
  card.appendChild(infoContainer);
  card.appendChild(footer);

  return card;
}
