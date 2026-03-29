import * as statisticService from "../services/statisticService.js";

export const getRankingMoreHours = async (req, res) => {
  try {
    const ranking = await statisticService.getRankingMoreHours();
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ranking` });
  }
};

export const getRankingIncreasedHours = async (req, res) => {
  try {
    const ranking = await statisticService.getRankingIncreasedHours();
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ranking` });
  }
};

export const getRankingAboveAverage = async (req, res) => {
  try {
    const ranking = await statisticService.getRankingAboveAverage();
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ranking` });
  }
};
