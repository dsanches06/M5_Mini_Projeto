export const validateTaskData = (req, res, next) => {
  const {
    title,
    description,
    task_status_id,
    priority_id,
    category_id,
    project_id,
    estimated_hours,
  } = req.body;

  if (!title || title.toString().trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!description || description.toString().trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  if (
    task_status_id === undefined ||
    task_status_id === null ||
    task_status_id.toString().trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Task status ID is required" });
  }

  if (
    priority_id === undefined ||
    priority_id === null ||
    priority_id.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "Priority ID is required" });
  }

  if (
    category_id === undefined ||
    category_id === null ||
    category_id.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  if (
    project_id === undefined ||
    project_id === null ||
    project_id.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  if (
    estimated_hours === undefined ||
    estimated_hours === null ||
    estimated_hours.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "Estimated hours is required" });
  }

  next();
};
