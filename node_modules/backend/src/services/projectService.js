import { db } from "../db.js";
import { mapProjectAPIResponse } from "../dto/mapDTO.js";

/* Função para buscar todos os projetos */
export const getAllProjects = async (search, sort) => {
  let query = "SELECT * FROM project";
  const params = [];

  if (search) {
    query += " WHERE (name LIKE ? OR description LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    query += ` ORDER BY name ${sort.toUpperCase()}`;
  }

  const [projects] = await db.query(query, params);
  return projects.map(mapProjectAPIResponse);
};

/* Função para buscar um projeto por ID */
export const getProjectById = async (projectId) => {
  const [projects] = await db.query("SELECT * FROM project WHERE id = ?", [projectId]);
  return projects.length > 0 ? mapProjectAPIResponse(projects[0]) : null;
};

/* Função para criar novo projeto */
export const createProject = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project (name, description, start_date, end_date_expected) VALUES (?, ?, ?, ?)",
    [data.name, data.description, data.start_date, data.end_date_expected],
  );
  return mapProjectAPIResponse({ id: result.insertId, ...data });
};

/* Função para atualizar projeto */
export const updateProject = async (projectId, data) => {
  // Constrói a query dinamicamente apenas com os campos fornecidos
  const fieldsToUpdate = [];
  const values = [];

  if (data.name !== undefined) {
    fieldsToUpdate.push("name = ?");
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fieldsToUpdate.push("description = ?");
    values.push(data.description);
  }
  if (data.project_status_id !== undefined) {
    fieldsToUpdate.push("project_status_id = ?");
    values.push(data.project_status_id);
  }
  if (data.start_date !== undefined) {
    fieldsToUpdate.push("start_date = ?");
    values.push(data.start_date);
  }
  if (data.end_date_expected !== undefined) {
    fieldsToUpdate.push("end_date_expected = ?");
    values.push(data.end_date_expected);
  }

  values.push(projectId);

  const [result] = await db.query(
    `UPDATE project SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows;
};

/* Função para deletar projeto */
export const deleteProject = async (projectId) => {
  const [result] = await db.query("DELETE FROM project WHERE id=?", [projectId]);
  return result.affectedRows;
};
