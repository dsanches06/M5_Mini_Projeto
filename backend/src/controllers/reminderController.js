import * as reminderService from "../services/reminderService.js";

export const getReminders = async (req, res) => {
  try {
    const reminders = await reminderService.getAllReminders();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: `Error fetching reminders: ${error.message}` });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { task_id, remind_at } = req.body;
    if (!task_id || !remind_at) {
      return res.status(400).json({ error: "task_id and remind_at are required" });
    }
    const reminder = await reminderService.createReminder(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: `Error creating reminder: ${error.message}` });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await reminderService.updateReminder(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json({ message: "Reminder updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating reminder: ${error.message}` });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await reminderService.deleteReminder(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting reminder: ${error.message}` });
  }
};
