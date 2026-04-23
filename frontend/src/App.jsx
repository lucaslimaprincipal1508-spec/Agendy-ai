import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import axios from 'axios';

// ==========================================
// CONFIGURAÇÃO DE ROTAS (PC vs NUVEM)
// ==========================================
// Puxa a URL da Vercel (se estiver na nuvem) ou usa localhost (se estiver no PC)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://agendy-ai-backend.onrender.com';

// Isso é obrigatório para o Axios enviar os cookies da sessão para o backend
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;