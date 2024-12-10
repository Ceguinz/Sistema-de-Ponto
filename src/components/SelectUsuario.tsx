import React from 'react';
import { Usuario, SelectUsuarioProps } from '../types';
import { useUsuarios } from '../hooks/useUsuarios';

export function SelectUsuario({ value, onChange, className = '' }: SelectUsuarioProps) {
  const { usuarios } = useUsuarios();

  return (
    <select
      className={`w-full p-2 border rounded-md ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecione...</option>
      {usuarios.map((usuario) => (
        <option key={usuario.id} value={usuario.id}>
          {usuario.nome} - {usuario.funcao}
        </option>
      ))}
    </select>
  );
}