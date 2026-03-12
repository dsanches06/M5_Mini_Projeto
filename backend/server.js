/*  */
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

/* Importação das rotas */
const projectsRoutes = require("./routes/projects");
const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");
const sprintsRoutes = require("./routes/sprints");
const commentsRoutes = require("./routes/comments");
const notificationsRoutes = require("./routes/notifications");

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Rotas */
app.use("/projects", projectsRoutes);
app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);
app.use("/comments", commentsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/sprints", sprintsRoutes);

/* Iniciar o servidor */
app.listen(PORT, () => {
  console.log(`Servidor ClickUp API em http://localhost:${PORT}`);
});
