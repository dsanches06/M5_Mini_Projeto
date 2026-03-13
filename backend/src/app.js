import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import logger from "./midlewares/loggerMiddleware.js";

const PORT = 3000;
const app = express();

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/sprints", sprintRoutes);

/* Iniciar o servidor */
app.listen(PORT, () => {
  console.log(`Servidor ClickUp API em http://localhost:${PORT}`);
});
