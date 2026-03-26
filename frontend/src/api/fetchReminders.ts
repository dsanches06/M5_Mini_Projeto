import { get, getById, create, put, remove } from "./index.js";
import { ReminderAPIResponse } from "./dto/index.js";

const ENDPOINT = "reminders";

/* Função para obter a lista de lembretes */
export async function getReminders(
  sort?: string,
  search?: string,
): Promise<ReminderAPIResponse[]> {
  return get<ReminderAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um lembrete por ID */
export async function getReminderById(
  id: number,
): Promise<ReminderAPIResponse | null> {
  return getById<ReminderAPIResponse>(ENDPOINT, id);
}

/* Função para criar um novo lembrete */
export async function createReminder(
  reminder: Partial<ReminderAPIResponse>,
): Promise<ReminderAPIResponse | null> {
  return create<ReminderAPIResponse>(ENDPOINT, reminder);
}

/* Função para atualizar um lembrete */
export async function updateReminder(
  id: number,
  reminder: Partial<ReminderAPIResponse>,
): Promise<ReminderAPIResponse | null> {
  return put<ReminderAPIResponse>(ENDPOINT, id, reminder);
}

/* Função para deletar um lembrete */
export async function deleteReminder(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
