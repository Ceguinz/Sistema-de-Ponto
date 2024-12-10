import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RegistroPonto } from '../types';
import { formatTime, calculateHours } from '../lib/utils';

export function useRegistroPonto(usuarioId: string) {
  const [registroHoje, setRegistroHoje] = useState<RegistroPonto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      carregarRegistroHoje();
    }
  }, [usuarioId]);

  const carregarRegistroHoje = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'registros'),
        where('usuarioId', '==', usuarioId),
        where('data', '==', hoje)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setRegistroHoje({ id: doc.id, ...doc.data() } as RegistroPonto);
      } else {
        setRegistroHoje(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const registrarPonto = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    const horaAtual = formatTime(new Date());

    try {
      if (!registroHoje) {
        // Registrar entrada
        await addDoc(collection(db, 'registros'), {
          usuarioId,
          data: hoje,
          entrada: horaAtual,
          saida: '',
          horasTrabalhadas: 0
        });
      } else if (!registroHoje.saida && registroHoje.id) {
        // Registrar saída
        const horasTrabalhadas = calculateHours(registroHoje.entrada, horaAtual);
        await updateDoc(doc(db, 'registros', registroHoje.id), {
          saida: horaAtual,
          horasTrabalhadas
        });
      }
      await carregarRegistroHoje();
    } catch (err) {
      console.error(err);
    }
  };

  return { registroHoje, loading, registrarPonto };
}