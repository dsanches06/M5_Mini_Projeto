import * as taskAttachmentService from "../services/taskAttachmentService.js";

export const getTaskAttachments = async (req, res) => {
  try {
    const taskAttachments = await taskAttachmentService.getAllTaskAttachments();
    res.json(taskAttachments);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task attachments: ${error.message}` });
  }
};

export const createTaskAttachment = async (req, res) => {
  try {
    const { task_id, file_name } = req.body;
    if (!task_id || !file_name) {
      return res.status(400).json({ error: "task_id and file_name are required" });
    }
    const taskAttachment = await taskAttachmentService.createTaskAttachment(req.body);
    res.status(201).json(taskAttachment);
  } catch (error) {
    res.status(400).json({ error: `Error creating task attachment: ${error.message}` });
  }
};

export const updateTaskAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAttachmentService.updateTaskAttachment(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task attachment not found" });
    }
    res.json({ message: "Task attachment updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating task attachment: ${error.message}` });
  }
};

export const deleteTaskAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAttachmentService.deleteTaskAttachment(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task attachment not found" });
    }
    res.json({ message: "Task attachment deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting task attachment: ${error.message}` });
  }
};
