import { format, parse, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const calculateHours = (entrada: string, saida: string): number => {
  try {
    const hoje = new Date();
    const dataBase = format(hoje, 'yyyy-MM-dd');
    
    const entradaDate = parse(`${dataBase} ${entrada}`, 'yyyy-MM-dd HH:mm', new Date());
    const saidaDate = parse(`${dataBase} ${saida}`, 'yyyy-MM-dd HH:mm', new Date());
    
    // Se a saída for menor que a entrada, assume que passou para o próximo dia
    let diffMinutes = differenceInMinutes(saidaDate, entradaDate);
    if (diffMinutes < 0) {
      diffMinutes = differenceInMinutes(saidaDate.setDate(saidaDate.getDate() + 1), entradaDate);
    }
    
    return Number((diffMinutes / 60).toFixed(2));
  } catch (error) {
    console.error('Erro ao calcular horas:', error);
    return 0;
  }
};

export const getMonthRange = (mesAno: string) => {
  const [ano, mes] = mesAno.split('-');
  const inicioMes = `${ano}-${mes}-01`;
  
  // Calcula o último dia do mês
  const ultimoDia = new Date(Number(ano), Number(mes), 0).getDate();
  const fimMes = `${ano}-${mes}-${ultimoDia}`;
  
  return { inicioMes, fimMes };
};