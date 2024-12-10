export interface Usuario {
  id?: string;
  nome: string;
  funcao: string;
  ra: string;
  emailAcademico: string;
}

export interface RegistroPonto {
  id?: string;
  usuarioId: string;
  data: string;
  entrada: string;
  saida: string;
  horasTrabalhadas: number;
  falta: boolean;
  observacao: string;
}