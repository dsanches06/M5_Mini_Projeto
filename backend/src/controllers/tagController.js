import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

export const getTags = (req, res) => {
  try {
    const tags = tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTag = (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ error: "Tag name cannot be empty" });
    }

    if (nome.length < 2) {
      return res.status(400).json({ error: "Tag name must be at least 2 characters" });
    }

    const tag = tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTag = (req, res) => {
  try {
    const tag = tagService.deleteTag(Number(req.params.id));
    taskService.removeTagFromAllTasks(Number(req.params.id));
    res.json({ message: "Tag deleted successfully", tag });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getTagTasks = (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const tag = tagService.getTagById(tagId);
    
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const taskRelations = taskService.getTagsByTaskId(tagId);
    const tasks = taskRelations.map((relation) => {
      return taskService.getTaskById(relation.taskId);
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
