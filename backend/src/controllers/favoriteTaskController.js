import * as favoriteTaskService from "../services/favoriteTaskService.js";

export const getFavoriteTasks = async (req, res) => {
  try {
    const favoriteTasks = await favoriteTaskService.getAllFavoriteTasks();
    res.json(favoriteTasks);
  } catch (error) {
    res.status(500).json({ error: `Error fetching favorite tasks: ${error.message}` });
  }
};

export const getFavoriteTaskById = async (req, res) => {
  try {
    const favoriteTask = await favoriteTaskService.getFavoriteTaskById(Number(req.params.id));
    if (!favoriteTask) {
      return res.status(404).json({ error: "Favorite task not found" });
    }
    res.json(favoriteTask);
  } catch (error) {
    res.status(500).json({ error: `Error fetching favorite task: ${error.message}` });
  }
};

export const createFavoriteTask = async (req, res) => {
  try {
    const { task_id, user_id } = req.body;
    if (!task_id || !user_id) {
      return res.status(400).json({ error: "task_id and user_id are required" });
    }
    const favoriteTask = await favoriteTaskService.createFavoriteTask(req.body);
    res.status(201).json(favoriteTask);
  } catch (error) {
    res.status(400).json({ error: `Error creating favorite task: ${error.message}` });
  }
};

export const updateFavoriteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await favoriteTaskService.updateFavoriteTask(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Favorite task not found" });
    }
    res.json({ message: "Favorite task updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating favorite task: ${error.message}` });
  }
};

export const deleteFavoriteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await favoriteTaskService.deleteFavoriteTask(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Favorite task not found" });
    }
    res.json({ message: "Favorite task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting favorite task: ${error.message}` });
  }
};
