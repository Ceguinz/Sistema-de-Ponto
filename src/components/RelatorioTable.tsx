import React from 'react';
import { RegistroPonto } from '../types';
import { format } from 'date-fns';

interface RelatorioTableProps {
  registros: RegistroPonto[];
  ra: string;
  emailAcademico: string;
}

export function RelatorioTable({ registros, ra, emailAcademico }: RelatorioTableProps) {
  return (
    <div>
      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        <p className="text-gray-700">RA: {ra}</p>
        <p className="text-gray-700">E-mail: {emailAcademico}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4">Data</th>
              <th className="p-4">Entrada</th>
              <th className="p-4">Saída</th>
              <th className="p-4">Horas</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id} className="border-t">
                <td className="p-4">
                  {format(new Date(registro.data), 'dd/MM/yyyy')}
                </td>
                <td className="p-4">{registro.entrada}</td>
                <td className="p-4">{registro.saida}</td>
                <td className="p-4">{registro.horasTrabalhadas.toFixed(2)}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}