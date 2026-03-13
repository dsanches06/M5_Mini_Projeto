import * as sprintService from "../services/sprintService.js";

export const getSprints = (req, res) => {
  const sprint = sprintService.getAllSprints();
  res.json(sprint);
};

export const createSprint = (req, res) => {
  const sprint = sprintService.createSprint(req.body);
  res.status(201).json(sprint);
};

export const updateSprint = (req, res) => {
  const sprint = sprintService.updateSprint(Number(req.params.id), req.body);
  res.json(sprint);
};

export const deleteSprint = (req, res) => {
  sprintService.deleteSprint(Number(req.params.id));
  res.json({ message: "Sprint deleted successfully" });
};

