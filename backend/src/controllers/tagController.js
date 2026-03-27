import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

/* Função para buscar etiquetas */
export const getTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: `Error fetching tags: ${error.message}` });
  }
};

export const getTagById = async (req, res) => {
  try {
    const tag = await tagService.getTagById(Number(req.params.id));
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: `Error fetching tag: ${error.message}` });
  }
};

/* Função para criar etiqueta */
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Tag name cannot be empty" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Tag name must have at least 2 characters" });
    }

    const tagExists = await tagService.tagNameExists(name.trim());
    if (tagExists) {
      return res.status(400).json({ message: "A tag with this name already exists" });
    }

    const tag = await tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: `Error creating tag: ${error.message}` });
  }
};

/* Função para deletar etiqueta */
export const deleteTag = async (req, res) => {
  try {
    const tag = await tagService.deleteTag(Number(req.params.id));
    await taskService.removeTagFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Tag deleted successfully", tag });
  } catch (error) {
    res.status(404).json({ message: `Error deleting tag: ${error.message}` });
  }
};

/* Função para buscar tarefas da etiqueta */
export const getTagTasks = async (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const tag = await tagService.getTagById(tagId);
    
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const taskRelations = await taskService.getTagsByTaskId(tagId);
    const tasks = await Promise.all(
      taskRelations.map((relation) =>
        taskService.getTaskById(relation.task_id),
      ),
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: `Error fetching tag tasks: ${error.message}` });
  }
};
