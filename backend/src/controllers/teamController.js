import * as teamService from "../services/teamService.js";

export const getTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: `Error fetching teams` });
  }
};
export const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(Number(req.params.id));
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: `Error fetching team: ${error.message}` });
  }
};
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Team name cannot be empty" });
    }
    const team = await teamService.createTeam(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: `Error creating team` });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await teamService.updateTeam(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json({ message: "Team updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating team` });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await teamService.deleteTeam(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting team` });
  }
};
