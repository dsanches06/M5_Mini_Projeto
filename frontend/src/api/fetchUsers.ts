import { IUser } from "../models/index.js";

/* Função para obter a lista de utilizadores */
export async function getUsers(): Promise<IUser[]> {
  const res = await fetch("http://localhost:3000/users");
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter utilizadores " + res.status);
  }
  const data: IUser[] = await res.json();
  console.table(data);
  return data;
}
