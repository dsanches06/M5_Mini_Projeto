import * as mentionService from "../services/mentionService.js";

export const getMentions = async (req, res) => {
  try {
    const mentions = await mentionService.getAllMentions();
    res.json(mentions);
  } catch (error) {
    res.status(500).json({ error: `Error fetching mentions: ${error.message}` });
  }
};

export const createMention = async (req, res) => {
  try {
    const { task_id, user_id } = req.body;
    if (!task_id || !user_id) {
      return res.status(400).json({ error: "task_id and user_id are required" });
    }
    const mention = await mentionService.createMention(req.body);
    res.status(201).json(mention);
  } catch (error) {
    res.status(400).json({ error: `Error creating mention: ${error.message}` });
  }
};

export const updateMention = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await mentionService.updateMention(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Mention not found" });
    }
    res.json({ message: "Mention updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating mention: ${error.message}` });
  }
};

export const deleteMention = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await mentionService.deleteMention(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Mention not found" });
    }
    res.json({ message: "Mention deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting mention: ${error.message}` });
  }
};
