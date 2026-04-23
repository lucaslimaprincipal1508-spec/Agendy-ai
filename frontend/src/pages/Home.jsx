import { useState } from 'react';
import axios from 'axios';

function Home() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post('/api/bookings', formData);
      setSuccess(true);
      setFormData({ customerName: '', customerPhone: '', date: '', time: '' });
    } catch (error) {
      alert('Erro ao agendar: ' + error.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      color: '#d4af37',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#00d4ff',
        textShadow: '0 0 20px #00d4ff',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        AGENDY.AI - Midnight Gold
      </h1>
      
      {success && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid #22c55e',
          color: '#22c55e',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          ✅ Agendamento confirmado!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'rgba(30, 30, 30, 0.8)',
        padding: '40px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '400px',
        border: '1px solid #d4af37',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#d4af37' }}>
            Nome Completo
          </label>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '15px',
              background: '#1f1f1f',
              color: 'white',
              border: '1px solid #d4af37',
              borderRadius: '10px',
              outline: 'none'
            }}
            placeholder="João Silva"
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#d4af37' }}>
            WhatsApp
          </label>
          <input
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '15px',
              background: '#1f1f1f',
              color: 'white',
              border: '1px solid #d4af37',
              borderRadius: '10px',
              outline: 'none'
            }}
            placeholder="(11) 99999-9999"
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#d4af37' }}>
              Data
            </label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                background: '#1f1f1f',
                color: 'white',
                border: '1px solid #d4af37',
                borderRadius: '10px',
                outline: 'none'
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#d4af37' }}>
              Horário
            </label>
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                background: '#1f1f1f',
                color: 'white',
                border: '1px solid #d4af37',
                borderRadius: '10px',
                outline: 'none'
              }}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '20px',
            background: loading ? '#666' : 'linear-gradient(45deg, #d4af37, #f1c40f)',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #f1c40f', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Processando...
            </span>
          ) : (
            '✨ Agendar Agora'
          )}
        </button>
      </form>
    </div>
  );
}

export default Home;
