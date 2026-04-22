import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [form, setForm] = useState({ customerName: '', customerPhone: '', date: '', time: '' });
  const [status, setStatus] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', form);
      setStatus('AGENDADO COM SUCESSO!');
      setForm({ customerName: '', customerPhone: '', date: '', time: '' });
    } catch (err) {
      setStatus('Erro ao conectar com o servidor');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: 'white' }}>
      <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '40px', borderRadius: '20px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '20px' }}>AGENDY.AI</h2>
        {status && <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', color: status.includes('SUCESSO') ? 'green' : 'red' }}>{status}</p>}
        <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Seu Nome" value={form.customerName} onChange={(e) => setForm({...form, customerName: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
          <input type="tel" placeholder="WhatsApp" value={form.customerPhone} onChange={(e) => setForm({...form, customerPhone: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
          <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
          <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} required />
          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>RESERVAR AGORA</button>
        </form>
      </div>
    </div>
  );
}

