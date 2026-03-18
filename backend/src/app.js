import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
<<<<<<< HEAD
import tagRoutes from "./routes/tagRoutes.js";
=======
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
import notificationRoutes from "./routes/notificationRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import logger from "./middlewares/loggerMiddleware.js";

const app = express();

dotenv.config();

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
<<<<<<< HEAD
app.use("/tags", tagRoutes);
=======
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
app.use("/notifications", notificationRoutes);
app.use("/sprints", sprintRoutes);

/* Iniciar o servidor */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ClickUp API em http://localhost:${PORT}`);
});
