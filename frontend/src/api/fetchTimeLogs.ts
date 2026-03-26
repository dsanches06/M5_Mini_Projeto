import { get, getById, create, put, remove } from "./index.js";
import { TimeLogAPIResponse } from "./dto/index.js";

const ENDPOINT = "time_logs";

export async function getTimeLogs(sort?: string, search?: string): Promise<TimeLogAPIResponse[]> {
  return get<TimeLogAPIResponse>(ENDPOINT, sort, search);
}

export async function getTimeLogById(id: number): Promise<TimeLogAPIResponse | null> {
  return getById<TimeLogAPIResponse>(ENDPOINT, id);
}

export async function createTimeLog(timeLog: Partial<TimeLogAPIResponse>): Promise<TimeLogAPIResponse | null> {
  return create<TimeLogAPIResponse>(ENDPOINT, timeLog);
}

export async function updateTimeLog(id: number, timeLog: Partial<TimeLogAPIResponse>): Promise<TimeLogAPIResponse | null> {
  return put<TimeLogAPIResponse>(ENDPOINT, id, timeLog);
}

export async function deleteTimeLog(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
