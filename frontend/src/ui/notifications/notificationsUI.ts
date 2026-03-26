import { IUser } from "../../models/index.js";
import { UserService } from "../../services/index.js";
import { toggleNotifications } from "./notificationBoxUI.js";

export async function createNotificationsUI(user: IUser): Promise<HTMLButtonElement> {
  const btnNotifications = document.createElement(
    "button",
  ) as HTMLButtonElement;
  btnNotifications.className = "icon-button";
  btnNotifications.addEventListener("click", async (event) => {
    event.stopPropagation();
    await toggleNotifications(user);
  });

  const spanIcone = document.createElement("span");
  const icone = document.createElement("i");

  spanIcone.appendChild(icone);

  const spanBadge = document.createElement("span") as HTMLSpanElement;
  spanBadge.className = "icon-button-badge";

  // Inicialmente mostrar um valor padrão
  spanBadge.textContent = "0";

  // Tentar obter notificações não lidas do utilizador
  try {
    const userId = user.getId();
    console.log("Obtendo notificações para userId:", userId);
    
    if (!userId) {
      throw new Error("UserId inválido");
    }
    
    const unreadNotifications = await UserService.getUnreadNotifications(userId);
    console.log("Notificações recebidas:", unreadNotifications);
    
    if (unreadNotifications) {
      // Contar apenas notificações não lidas
      const notifyCount = unreadNotifications.filter(n => !n.isNotificationRead()).length;
      spanBadge.textContent = notifyCount.toString();
      console.log("Badge atualizado com:", notifyCount);
    }
  } catch (error) {
    console.error("Erro ao obter notificações da API:", error);
    // Mostrar erro no badge para que o utilizador saiba que há um problema
    spanBadge.textContent = "!";
    spanBadge.style.backgroundColor = "red";
  }

  icone.className = "fa-solid fa-bell fa-2xl fa-shake";
  icone.style.animationIterationCount = "1";

  icone.addEventListener(
    "animationend",
    () => {
      icone.classList.remove("fa-shake");
      icone.style.animationIterationCount = ""; // Limpa o estilo inline
    },
    { once: true },
  );

  btnNotifications.appendChild(spanIcone);
  btnNotifications.appendChild(spanBadge);

  return btnNotifications;
}
