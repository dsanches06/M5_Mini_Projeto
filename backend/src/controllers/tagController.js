import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

/* Função para buscar tags */
export const getTags = (req, res) => {
  try {
    const tags = tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar tags: ${error.message}` });
  }
};

/* Função para criar tag */
export const createTag = (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome da tag não pode estar vazio" });
    }

    if (nome.length < 2) {
      return res.status(400).json({ error: "O nome da tag deve ter no mínimo 2 caracteres" });
    }

    const tag = tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar tag: ${error.message}` });
  }
};

/* Função para deletar tag */
export const deleteTag = (req, res) => {
  try {
    const tag = tagService.deleteTag(Number(req.params.id));
    taskService.removeTagFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Tag deletada com sucesso", tag });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar tag: ${error.message}` });
  }
};

/* Função para buscar tarefas da tag */
export const getTagTasks = (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const tag = tagService.getTagById(tagId);
    
    if (!tag) {
      return res.status(404).json({ error: "Tag não encontrada" });
    }

    const taskRelations = taskService.getTagsByTaskId(tagId);
    const tasks = taskRelations.map((relation) => {
      return taskService.getTaskById(relation.taskId);
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar tarefas da tag: ${error.message}` });
  }
};
