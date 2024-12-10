import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RegistroPonto, Usuario } from '../types';

export function gerarRelatorioPDF(registros: RegistroPonto[], usuario: Usuario, mesAno: string) {
  const doc = new jsPDF();
  const dataMes = parse(mesAno, 'yyyy-MM', new Date());
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.text('Relatório de Ponto', 14, 15);
  
  doc.setFontSize(12);
  doc.text(`Funcionário: ${usuario.nome}`, 14, 25);
  doc.text(`Função: ${usuario.funcao}`, 14, 32);
  doc.text(`RA: ${usuario.ra}`, 14, 39);
  doc.text(`E-mail: ${usuario.emailAcademico}`, 14, 46);
  doc.text(`Período: ${format(dataMes, 'MMMM/yyyy', { locale: ptBR })}`, 14, 53);

  // Tabela de registros
  const dados = registros.map(registro => [
    format(new Date(registro.data), 'dd/MM/yyyy'),
    registro.entrada,
    registro.saida,
    `${registro.horasTrabalhadas.toFixed(2)}h`
  ]);

  autoTable(doc, {
    head: [['Data', 'Entrada', 'Saída', 'Horas']],
    body: dados,
    startY: 60,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Total de horas
  const totalHoras = registros.reduce((acc, registro) => acc + registro.horasTrabalhadas, 0);
  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.text(`Total de Horas no Mês: ${totalHoras.toFixed(2)}h`, 14, finalY + 10);

  return doc;
}

export function gerarRelatorioCompletoPDF(usuarios: Usuario[], registrosPorUsuario: Record<string, number>, mesAno: string) {
  const doc = new jsPDF();
  const dataMes = parse(mesAno, 'yyyy-MM', new Date());
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.text('Relatório Mensal Completo', 14, 15);
  
  doc.setFontSize(12);
  doc.text(`Período: ${format(dataMes, 'MMMM/yyyy', { locale: ptBR })}`, 14, 25);

  // Dados para a tabela
  const dados = usuarios.map(usuario => [
    usuario.nome,
    usuario.funcao,
    usuario.ra,
    usuario.emailAcademico,
    `${(registrosPorUsuario[usuario.id || ''] || 0).toFixed(2)}h`
  ]);

  // Tabela
  autoTable(doc, {
    head: [['Nome', 'Função', 'RA', 'E-mail', 'Total de Horas']],
    body: dados,
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 139, 202] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 60 },
      4: { cellWidth: 25 }
    }
  });

  return doc;
}