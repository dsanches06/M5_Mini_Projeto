import { get, getById, create, put, remove } from "./index.js";
import { ReminderAPIResponse } from "./dto/index.js";

const ENDPOINT = "reminders";

export async function getReminders(sort?: string, search?: string): Promise<ReminderAPIResponse[]> {
  return get<ReminderAPIResponse>(ENDPOINT, sort, search);
}

export async function getReminderById(id: number): Promise<ReminderAPIResponse | null> {
  return getById<ReminderAPIResponse>(ENDPOINT, id);
}

export async function createReminder(reminder: Partial<ReminderAPIResponse>): Promise<ReminderAPIResponse | null> {
  return create<ReminderAPIResponse>(ENDPOINT, reminder);
}

export async function updateReminder(id: number, reminder: Partial<ReminderAPIResponse>): Promise<ReminderAPIResponse | null> {
  return put<ReminderAPIResponse>(ENDPOINT, id, reminder);
}

export async function deleteReminder(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
