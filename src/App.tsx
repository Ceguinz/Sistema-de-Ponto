import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Usuarios } from './pages/Usuarios';
import { Relatorios } from './pages/Relatorios';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;