import { get, getById, create, put, remove } from "./index.js";
import { TimeLogAPIResponse } from "./dto/index.js";

const ENDPOINT = "time_logs";
/* Função para obter a lista de registros de tempo */export async function getTimeLogs(sort?: string, search?: string): Promise<TimeLogAPIResponse[]> {
  return get<TimeLogAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um registro de tempo por ID */
export async function getTimeLogById(id: number): Promise<TimeLogAPIResponse | null> {
  return getById<TimeLogAPIResponse>(ENDPOINT, id);
}

/* Função para criar um novo registro de tempo */
export async function createTimeLog(timeLog: Partial<TimeLogAPIResponse>): Promise<TimeLogAPIResponse | null> {
  return create<TimeLogAPIResponse>(ENDPOINT, timeLog);
}

/* Função para atualizar um registro de tempo */
export async function updateTimeLog(id: number, timeLog: Partial<TimeLogAPIResponse>): Promise<TimeLogAPIResponse | null> {
  return put<TimeLogAPIResponse>(ENDPOINT, id, timeLog);
}

/* Função para deletar um registro de tempo */
export async function deleteTimeLog(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
