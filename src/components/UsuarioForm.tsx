import React from 'react';

interface UsuarioFormProps {
  nome: string;
  funcao: string;
  ra: string;
  emailAcademico: string;
  editando: string | null;
  onNomeChange: (nome: string) => void;
  onFuncaoChange: (funcao: string) => void;
  onRaChange: (ra: string) => void;
  onEmailAcademicoChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelar: () => void;
}

export function UsuarioForm({
  nome,
  funcao,
  ra,
  emailAcademico,
  editando,
  onNomeChange,
  onFuncaoChange,
  onRaChange,
  onEmailAcademicoChange,
  onSubmit,
  onCancelar
}: UsuarioFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => onNomeChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Nome do funcionário"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2">Função</label>
        <input
          type="text"
          value={funcao}
          onChange={(e) => onFuncaoChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Cargo/Função"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">RA (Registro Acadêmico)</label>
        <input
          type="text"
          value={ra}
          onChange={(e) => onRaChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Digite o RA"
          pattern="[0-9]*"
          title="Digite apenas números"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">E-mail Acadêmico</label>
        <input
          type="email"
          value={emailAcademico}
          onChange={(e) => onEmailAcademicoChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="exemplo@academico.com"
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {editando ? 'Salvar Alterações' : 'Cadastrar'}
        </button>

        {editando && (
          <button
            type="button"
            onClick={onCancelar}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}