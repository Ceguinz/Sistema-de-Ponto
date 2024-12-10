import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RegistroPonto } from '../types';
import { calculateHours } from '../lib/utils';
import { RegistroPontoForm } from '../components/RegistroPontoForm';

export function Home() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [falta, setFalta] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [registroDia, setRegistroDia] = useState<RegistroPonto | null>(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (usuarioSelecionado && dataSelecionada) {
      carregarRegistroDia();
    }
  }, [usuarioSelecionado, dataSelecionada]);

  const carregarRegistroDia = async () => {
    try {
      const q = query(
        collection(db, 'registros'),
        where('usuarioId', '==', usuarioSelecionado),
        where('data', '==', dataSelecionada)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const registro = { id: doc.id, ...doc.data() } as RegistroPonto;
        setRegistroDia(registro);
        setEntrada(registro.entrada || '');
        setSaida(registro.saida || '');
        setFalta(registro.falta || false);
        setObservacao(registro.observacao || '');
      } else {
        setRegistroDia(null);
        setEntrada('');
        setSaida('');
        setFalta(false);
        setObservacao('');
      }
      setMensagem('');
    } catch (error) {
      console.error('Erro ao carregar registro:', error);
      setMensagem('Erro ao carregar registro do dia.');
    }
  };

  const registrarPonto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioSelecionado) {
      setMensagem('Por favor, selecione o usuário.');
      return;
    }

    try {
      const horasTrabalhadas = falta ? 0 : (entrada && saida ? calculateHours(entrada, saida) : 0);

      const dados = {
        usuarioId: usuarioSelecionado,
        data: dataSelecionada,
        entrada: falta ? '' : entrada,
        saida: falta ? '' : saida,
        falta,
        observacao,
        horasTrabalhadas
      };

      if (!registroDia) {
        await addDoc(collection(db, 'registros'), dados);
        setMensagem('Registro salvo com sucesso!');
      } else if (registroDia.id) {
        await updateDoc(doc(db, 'registros', registroDia.id), dados);
        setMensagem('Registro atualizado com sucesso!');
      }

      carregarRegistroDia();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      setMensagem('Erro ao salvar o registro.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registro de Ponto
        </h2>
        
        {mensagem && (
          <div className={`mb-4 p-3 rounded-md ${
            mensagem.includes('Erro') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {mensagem}
          </div>
        )}
        
        <RegistroPontoForm
          usuarioSelecionado={usuarioSelecionado}
          dataSelecionada={dataSelecionada}
          entrada={entrada}
          saida={saida}
          falta={falta}
          observacao={observacao}
          onUsuarioChange={setUsuarioSelecionado}
          onDataChange={setDataSelecionada}
          onEntradaChange={setEntrada}
          onSaidaChange={setSaida}
          onFaltaChange={setFalta}
          onObservacaoChange={setObservacao}
          onSubmit={registrarPonto}
        />

        {registroDia && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">Registro do Dia</h3>
            {registroDia.falta ? (
              <p className="text-red-600">Falta Registrada</p>
            ) : (
              <>
                <p>Entrada: {registroDia.entrada}</p>
                {registroDia.saida && (
                  <>
                    <p>Saída: {registroDia.saida}</p>
                    <p>Horas trabalhadas: {registroDia.horasTrabalhadas.toFixed(2)}h</p>
                  </>
                )}
              </>
            )}
            {registroDia.observacao && (
              <p className="mt-2">Observação: {registroDia.observacao}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}