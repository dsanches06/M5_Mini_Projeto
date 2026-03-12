export function menuSelected(id: string) {
  const links = document.querySelectorAll(".js-link");
  links.forEach((item) => item.classList.remove("menu-actived"));

  const menu = document.querySelector(`${id}`) as HTMLAnchorElement;
  if (menu) {
    menu.classList.add("menu-actived");
  } else {
    console.warn(`Elemento ${id} não foi renderizado no DOM.`);
  }
}
