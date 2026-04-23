import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Busca os dados do usuário e depois busca os agendamentos dele
    axios.get('/auth/me')
      .then((response) => {
        setUser(response.data);
        return axios.get('/appointments'); // Busca a lista logo em seguida
      })
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(() => {
        navigate('/'); // Se der BO, joga pro login
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      navigate('/');
    } catch (error) {
      console.error("Erro ao deslogar", error);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault(); // Evita recarregar a página
    try {
      const response = await axios.post('/appointments', { date, time });
      // Adiciona o novo agendamento na lista da tela sem precisar dar refresh
      setAppointments([...appointments, response.data]);
      // Limpa os campos
      setDate('');
      setTime('');
    } catch (error) {
      alert("Erro ao criar agendamento.");
      console.error(error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`/appointments/${id}`);
      // Remove da tela o agendamento que foi deletado
      setAppointments(appointments.filter(app => app.id !== id));
    } catch (error) {
      alert("Erro ao cancelar agendamento.");
      console.error(error);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-xl">Carregando Agendy-ai...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* CABEÇALHO DO USUÁRIO */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            {user.photo && <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200" />}
            <div>
              <h2 className="text-xl font-bold text-gray-800">Olá, {user.name.split(' ')[0]}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 font-medium transition">
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* FORMULÁRIO DE AGENDAMENTO */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Novo Agendamento</h3>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Confirmar Horário
              </button>
            </form>
          </div>

          {/* LISTA DE AGENDAMENTOS */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Meus Horários</h3>
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Nenhum agendamento marcado.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((app) => (
                  <div key={app.id} className="flex justify-between items-center border border-gray-100 bg-gray-50 p-3 rounded-md">
                    <div>
                      {/* Formata a data para ficar bonitinha (ex: 22/04/2026) */}
                      <p className="font-bold text-gray-800">{new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                      <p className="text-sm text-gray-600">⏰ {app.time}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAppointment(app.id)}
                      className="text-red-500 text-sm font-semibold hover:text-red-700 hover:underline"
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}