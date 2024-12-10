import React from 'react';
import { Usuario } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

interface UsuarioListProps {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onExcluir: (id: string) => void;
}

export function UsuarioList({ usuarios, onEditar, onExcluir }: UsuarioListProps) {
  return (
    <div className="grid gap-4">
      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="p-4 border rounded-md hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{usuario.nome}</h3>
              <p className="text-gray-600">{usuario.funcao}</p>
              <p className="text-sm text-gray-500">RA: {usuario.ra}</p>
              <p className="text-sm text-gray-500">{usuario.emailAcademico}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEditar(usuario)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Editar usuário"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => usuario.id && onExcluir(usuario.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                title="Excluir usuário"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}