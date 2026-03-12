import {
  loadInitialUsers,
  loadAInitialTasks,
} from "./src/ui/gestUserTask/index.js";

window.onload = () => {
  loadInitialUsers();
};

//obter o menu task
const menuUsers = document.querySelector("#menuUsers") as HTMLAnchorElement;
menuUsers.addEventListener("click", () => {
  loadInitialUsers();
});

//obter o menu task
const menuTasks = document.querySelector("#menuTasks") as HTMLAnchorElement;
menuTasks.addEventListener("click", () => {
  loadAInitialTasks();
});
