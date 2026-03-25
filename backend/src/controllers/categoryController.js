import * as categoryService from "../services/categoryService.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: `Error fetching categories: ${error.message}` });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Category name cannot be empty" });
    }
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: `Error creating category: ${error.message}` });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await categoryService.updateCategory(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating category: ${error.message}` });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await categoryService.deleteCategory(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting category: ${error.message}` });
  }
};
