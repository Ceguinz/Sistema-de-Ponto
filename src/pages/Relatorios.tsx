import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Usuario, RegistroPonto } from '../types';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RelatorioTable } from '../components/RelatorioTable';
import { FileDown } from 'lucide-react';
import { gerarRelatorioPDF, gerarRelatorioCompletoPDF } from '../lib/pdfGenerator';

export function Relatorios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [mesAno, setMesAno] = useState(format(new Date(), 'yyyy-MM'));
  const [totalHoras, setTotalHoras] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    if (usuarioSelecionado && mesAno) {
      carregarRegistros();
    }
  }, [usuarioSelecionado, mesAno]);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Usuario));
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarRegistros = async () => {
    try {
      setLoading(true);
      const [ano, mes] = mesAno.split('-');
      const inicioMes = `${ano}-${mes}-01`;
      const ultimoDia = new Date(Number(ano), Number(mes), 0).getDate();
      const fimMes = `${ano}-${mes}-${ultimoDia}`;

      const q = query(
        collection(db, 'registros'),
        where('usuarioId', '==', usuarioSelecionado),
        where('data', '>=', inicioMes),
        where('data', '<=', fimMes)
      );

      const querySnapshot = await getDocs(q);
      const registrosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RegistroPonto));

      setRegistros(registrosData.sort((a, b) => a.data.localeCompare(b.data)));
      setTotalHoras(null);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalHoras = () => {
    const total = registros.reduce((acc, registro) => acc + registro.horasTrabalhadas, 0);
    setTotalHoras(total);
  };

  const exportarPDF = () => {
    const usuarioAtual = usuarios.find(u => u.id === usuarioSelecionado);
    if (!usuarioAtual) return;

    const doc = gerarRelatorioPDF(registros, usuarioAtual, mesAno);
    doc.save(`relatorio-${usuarioAtual.nome}-${mesAno}.pdf`);
  };

  const gerarRelatorioCompleto = async () => {
    try {
      setLoading(true);
      const [ano, mes] = mesAno.split('-');
      const inicioMes = `${ano}-${mes}-01`;
      const ultimoDia = new Date(Number(ano), Number(mes), 0).getDate();
      const fimMes = `${ano}-${mes}-${ultimoDia}`;

      const registrosPorUsuario: Record<string, number> = {};

      for (const usuario of usuarios) {
        if (!usuario.id) continue;

        const q = query(
          collection(db, 'registros'),
          where('usuarioId', '==', usuario.id),
          where('data', '>=', inicioMes),
          where('data', '<=', fimMes)
        );

        const querySnapshot = await getDocs(q);
        const registrosUsuario = querySnapshot.docs.map(doc => ({
          ...doc.data()
        } as RegistroPonto));

        const totalHoras = registrosUsuario.reduce(
          (acc, registro) => acc + registro.horasTrabalhadas,
          0
        );

        registrosPorUsuario[usuario.id] = totalHoras;
      }

      const doc = gerarRelatorioCompletoPDF(usuarios, registrosPorUsuario, mesAno);
      doc.save(`relatorio-completo-${mesAno}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
    } finally {
      setLoading(false);
    }
  };

  const usuarioAtual = usuarios.find(u => u.id === usuarioSelecionado);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Relatório de Horas</h2>
          <button
            onClick={gerarRelatorioCompleto}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            <FileDown size={20} />
            Relatório Completo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Funcionário</label>
            <select
              className="w-full p-2 border rounded-md"
              value={usuarioSelecionado}
              onChange={(e) => setUsuarioSelecionado(e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione...</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mês/Ano</label>
            <input
              type="month"
              value={mesAno}
              onChange={(e) => setMesAno(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : usuarioAtual && registros.length > 0 ? (
          <>
            <div className="mb-4 p-4 bg-blue-50 rounded-md flex justify-between items-center">
              <h3 className="font-semibold text-blue-800">
                Relatório: {usuarioAtual.nome} - {format(parse(mesAno, 'yyyy-MM', new Date()), 'MMMM/yyyy', { locale: ptBR })}
              </h3>
              <button
                onClick={exportarPDF}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FileDown size={20} />
                Exportar PDF
              </button>
            </div>

            <RelatorioTable 
              registros={registros} 
              ra={usuarioAtual.ra} 
              emailAcademico={usuarioAtual.emailAcademico}
            />

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={calcularTotalHoras}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Somar Horas do Mês
              </button>
              
              {totalHoras !== null && (
                <p className="text-lg font-semibold">
                  Total de horas no mês: {totalHoras.toFixed(2)}h
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-8">
            {!usuarioAtual 
              ? 'Selecione um funcionário e um mês para ver o relatório'
              : 'Nenhum registro encontrado para o período selecionado'}
          </p>
        )}
      </div>
    </div>
  );
}