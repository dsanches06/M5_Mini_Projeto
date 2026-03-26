
/** Converter status numérico para booleano */
export function getStatus(status: number): boolean {
  return status === 1 ? true : false;
}

/* Função auxiliar para converter data seguramente */
export function parseDate(date: any): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === "string") {
    return new Date(date);
  }
  return new Date();
}
