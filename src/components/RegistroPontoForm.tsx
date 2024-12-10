import React from 'react';
import { SelectUsuario } from './SelectUsuario';

interface RegistroPontoFormProps {
  usuarioSelecionado: string;
  dataSelecionada: string;
  entrada: string;
  saida: string;
  falta: boolean;
  observacao: string;
  onUsuarioChange: (id: string) => void;
  onDataChange: (data: string) => void;
  onEntradaChange: (hora: string) => void;
  onSaidaChange: (hora: string) => void;
  onFaltaChange: (falta: boolean) => void;
  onObservacaoChange: (obs: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegistroPontoForm({
  usuarioSelecionado,
  dataSelecionada,
  entrada,
  saida,
  falta,
  observacao,
  onUsuarioChange,
  onDataChange,
  onEntradaChange,
  onSaidaChange,
  onFaltaChange,
  onObservacaoChange,
  onSubmit
}: RegistroPontoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Funcionário</label>
        <SelectUsuario
          value={usuarioSelecionado}
          onChange={onUsuarioChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Data</label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => onDataChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={falta}
          onChange={(e) => onFaltaChange(e.target.checked)}
          className="mr-2"
          id="falta"
        />
        <label htmlFor="falta" className="text-gray-700">Registrar Falta</label>
      </div>

      {!falta && (
        <>
          <div>
            <label className="block text-gray-700 mb-2">Horário de Entrada</label>
            <input
              type="time"
              value={entrada}
              onChange={(e) => onEntradaChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Horário de Saída</label>
            <input
              type="time"
              value={saida}
              onChange={(e) => onSaidaChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-gray-700 mb-2">Observação</label>
        <textarea
          value={observacao}
          onChange={(e) => onObservacaoChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Digite uma observação (opcional)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Salvar Registro
      </button>
    </form>
  );
}