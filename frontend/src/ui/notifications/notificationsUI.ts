export function createNotificationsUI(): HTMLButtonElement {
  const btnNotifications = document.createElement(
    "button",
  ) as HTMLButtonElement;
  btnNotifications.className = "icon-button";

  const spanIcone = document.createElement("span");
  const icone = document.createElement("i");

  spanIcone.appendChild(icone);

  const spanBadge = document.createElement("span") as HTMLSpanElement;
  spanBadge.className = "icon-button-badge";

  const notify = Math.floor(Math.random() * 5);
  icone.className = "fa-solid fa-bell fa-2xl fa-shake";
  icone.style.animationIterationCount = "1";
  spanBadge.textContent = notify.toString();

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
