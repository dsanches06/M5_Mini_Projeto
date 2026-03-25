import { ITask } from "../tasks/index.js";

/* Função para obter a lista de tarefas */
export async function getTasks(): Promise<ITask[]> {
  const res = await fetch("http://localhost:3000/tasks");
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter tarefas " + res.status);
  }
  const data: ITask[] = await res.json();
  console.table(data);
  return data;
}