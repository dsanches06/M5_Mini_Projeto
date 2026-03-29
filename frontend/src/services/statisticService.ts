import * as fetchstatistics from "../api/index.js";
import {
  RankingAboveAverageAPIResponse,
  RankingIncreaseHoursAPIResponse,
  RankingMoreHoursAPIResponse,
} from "../api/dto/index.js";

export class StatisticsService {

  /* Função para obter ranking com mais horas */
  async getRankingMoreHours(): Promise<RankingMoreHoursAPIResponse[]> {
    return fetchstatistics.getRankingMoreHours();
  }

  /* Função para obter ranking com horas aumentadas */
  async getRankingIncreasedHours(): Promise<RankingIncreaseHoursAPIResponse[]> {
    return fetchstatistics.getRankingIncreasedHours();
  }

  /* Função para obter ranking acima da média */
  async getRankingAboveAverage(): Promise<RankingAboveAverageAPIResponse[]> {
    return fetchstatistics.getRankingAboveAverage();
  }
}
