import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import logger from "./middlewares/loggerMiddleware.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/tags", tagRoutes);
app.use("/notifications", notificationRoutes);
app.use("/sprints", sprintRoutes);

/* Iniciar o servidor */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ClickUp API em http://localhost:${PORT}`);
});
