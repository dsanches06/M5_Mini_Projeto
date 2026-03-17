import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import logger from "./middlewares/loggerMiddleware.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/notifications", notificationRoutes);
app.use("/sprints", sprintRoutes);

/* Iniciar o servidor */
app.listen(process.env.PORT, () => {
  console.log(`Servidor ClickUp API em http://localhost:${process.env.PORT}`);
});
