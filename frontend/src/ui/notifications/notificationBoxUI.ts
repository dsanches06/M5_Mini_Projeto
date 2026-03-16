import Notifications from "../../notifications/Notifications.js";
import { addElementInContainer, createSection } from "../dom/index.js";

// Dados de exemplo
const notifications: Notifications[] = [
  new Notifications("@lorem ipsum dolor sit amet"),
  new Notifications("@lorem ipsum dolor sit amet"),
  new Notifications("@lorem ipsum dolor sit amet"),
  new Notifications("@lorem ipsum dolor sit amet"),
  new Notifications("@lorem ipsum dolor sit amet"),
];

// Track toggle state across function calls
let isNotificationBoxOpen = false;

function createNotificationItem(data: Notifications): HTMLDivElement {
  const item = document.createElement("div");
  item.className = "notifi-item";

  const textDiv = document.createElement("div");
  textDiv.className = "text";

  const p = document.createElement("p");
  p.textContent = data.getMessage();

  item.appendChild(p);

  return item;
}

/**
 * Renderiza todas as notificações no contentor
 */
function renderNotifications(): void {
  let box = document.querySelector("#box") as HTMLElement;

  // Se o elemento não existir, cria-o e adiciona ao documento
  if (!box) {
    box = createSection("box") as HTMLElement;
    box.className = "notifi-box";

    // Adiciona um título
    const h2 = document.createElement("h2");
    h2.textContent = "Notificações";
    box.appendChild(h2);

    document.body.appendChild(box);
  } else {
    // Limpa itens antigos, mantendo apenas o título H2
    const title = box.querySelector("h2");
    const items = box.querySelectorAll(".notifi-item");
    items.forEach((item) => item.remove());
    if (!title) {
      const h2 = document.createElement("h2");
      h2.textContent = "Notificações";
      box.insertBefore(h2, box.firstChild);
    }
  }

  // Adiciona os novos itens
  notifications.forEach((notif) => {
    box.appendChild(createNotificationItem(notif));
  });
}

export function toggleNotifications(): void {
  renderNotifications();

  const box = document.querySelector("#box") as HTMLElement;

  if (!box) {
    console.warn("Notification box element not found");
    return;
  }

  if (isNotificationBoxOpen) {
    box.classList.remove("open");
    box.classList.remove("bottom");
    isNotificationBoxOpen = false;
  } else {
    // Detecta se deve aparecer de baixo ou de cima
    const notificationButton = document.querySelector("button.icon-button");

    if (notificationButton) {
      const buttonRect = notificationButton.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      // Se há menos de 650px de espaço abaixo, posiciona de baixo para cima
      if (spaceBelow < 650) {
        box.classList.add("bottom");
      } else {
        box.classList.remove("bottom");
      }
    }

    box.classList.add("open");
    isNotificationBoxOpen = true;
  }
}
