import { get } from "./index.js";
import {
  RankingAboveAverageAPIResponse,
  RankingIncreaseHoursAPIResponse,
  RankingMoreHoursAPIResponse,
} from "./dto/index.js";

const ENDPOINT = "statistics/ranking";

/* Função para obter ranking com mais horas */
export async function getRankingMoreHours(): Promise<
  RankingMoreHoursAPIResponse[]
> {
  return get<RankingMoreHoursAPIResponse>(`${ENDPOINT}/morehours`);
}

/* Função para obter ranking com horas aumentadas */
export async function getRankingIncreasedHours(): Promise<
  RankingIncreaseHoursAPIResponse[]
> {
  return get<RankingIncreaseHoursAPIResponse>(`${ENDPOINT}/increasedhours`);
}

/* Função para obter ranking acima da média */
export async function getRankingAboveAverage(): Promise<
  RankingAboveAverageAPIResponse[]
> {
  return get<RankingAboveAverageAPIResponse>(`${ENDPOINT}/aboveaverage`);
}
