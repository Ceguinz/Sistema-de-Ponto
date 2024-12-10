import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock size={24} />
            <h1 className="text-xl font-bold">Sistema de Ponto</h1>
          </div>
          <nav className="space-x-4">
            <Link to="/" className="hover:text-blue-200">Início</Link>
            <Link to="/usuarios" className="hover:text-blue-200">Usuários</Link>
            <Link to="/relatorios" className="hover:text-blue-200">Relatórios</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}