import { StatisticsUI } from "./src/ui/statistics/StatisticsUI.js";
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




const stats = new StatisticsUI('containerSection');
stats.setData([
  { name: 'Jan', sales: 100 },
  { name: 'Feb', sales: 200 }
]);

// Use any of these:
stats.renderBarChart('name', 'sales');
stats.renderLineChart('name', 'sales');
stats.renderPieChart('name', 'sales');
