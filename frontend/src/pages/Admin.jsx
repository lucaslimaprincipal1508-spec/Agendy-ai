import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      alert('Erro ao carregar agendamentos');
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status });
      fetchBookings();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  if (loading) return <div style={{ color: '#d4af37', fontSize: '2rem', textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      color: '#d4af37',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#00d4ff',
          textShadow: '0 0 20px #00d4ff'
        }}>
          Admin - Agendamentos
        </h1>
        <button 
          onClick={fetchBookings}
          style={{
            padding: '12px 24px',
            background: '#00d4ff',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔄 Atualizar
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {bookings.map((booking) => (
          <div key={booking.id} style={{
            background: 'rgba(30, 30, 30, 0.8)',
            padding: '30px',
            borderRadius: '20px',
            borderLeft: `5px solid ${booking.status === 'PENDING' ? '#f59e0b' : booking.status === 'CONFIRMED' ? '#10b981' : '#ef4444'}`
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '1.5rem' }}>{booking.customerName}</h3>
                <p style={{ color: '#d4af37', marginBottom: '5px' }}>📱 {booking.customerPhone}</p>
                <p style={{ color: '#00d4ff', marginBottom: '5px' }}>📅 {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                <span style={{
                  padding: '6px 12px',
                  background: booking.status === 'PENDING' ? '#f59e0b' : booking.status === 'CONFIRMED' ? '#10b981' : '#ef4444',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {booking.status === 'PENDING' ? '⏳ Pendente' : booking.status === 'CONFIRMED' ? '✅ Confirmado' : '❌ Cancelado'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                  disabled={booking.status === 'CONFIRMED'}
                  style={{
                    padding: '12px 20px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: booking.status === 'CONFIRMED' ? 'not-allowed' : 'pointer',
                    opacity: booking.status === 'CONFIRMED' ? 0.5 : 1
                  }}
                >
                  ✅ Confirmar
                </button>
                <button
                  onClick={() => updateStatus(booking.id, 'CANCELLED')}
                  disabled={booking.status === 'CANCELLED'}
                  style={{
                    padding: '12px 20px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: booking.status === 'CANCELLED' ? 'not-allowed' : 'pointer',
                    opacity: booking.status === 'CANCELLED' ? 0.5 : 1
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
