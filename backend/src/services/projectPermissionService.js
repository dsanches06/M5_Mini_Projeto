import { db } from "../db.js";
import { mapProjectPermissionAPIResponse } from "../dto/mapDTO.js";

export const getAllProjectPermissions = async () => {
  const [permissions] = await db.query("SELECT * FROM project_permission");
  return permissions.map(mapProjectPermissionAPIResponse);
};

export const createProjectPermission = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project_permission (project_id, user_id, permission) VALUES (?, ?, ?)",
    [data.project_id, data.user_id, data.permission]
  );
  return mapProjectPermissionAPIResponse({ id: result.insertId, ...data });
};

export const updateProjectPermission = async (id, data) => {
  const [result] = await db.query("UPDATE project_permission SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteProjectPermission = async (id) => {
  const [result] = await db.query("DELETE FROM project_permission WHERE id = ?", [id]);
  return result.affectedRows;
};
