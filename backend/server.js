require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// ====================================================
// CONFIGURAÇÕES DE URL E PORTA
// ====================================================
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';
const PORT = isProduction ? (process.env.PORT || 3000) : 3000;

// ====================================================
// MIDDLEWARES
// ====================================================
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ====================================================
// PASSPORT GOOGLE STRATEGY
// ====================================================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const photo = profile.photos[0].value;

      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        user = await prisma.user.create({
          data: { name, email, photo }
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// ====================================================
// ROTAS DE AUTENTICAÇÃO (A VERSÃO "CALA BOCA" NO GOOGLE)
// ====================================================

// 1. Rota de IDA (Montada na mão pra não sumir o scope)
app.get('/auth/google', (req, res) => {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${BACKEND_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid profile email', // Injetando os 3 scopes necessários
    access_type: 'offline',
    prompt: 'consent'
  });

  res.redirect(`${googleAuthUrl}?${params.toString()}`);
});

// 2. Rota de VOLTA (Continua usando o Passport pra processar os dados)
app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: FRONTEND_URL 
  }, (err, user) => {
    if (err || !user) {
      console.error("Erro no callback:", err);
      return res.redirect(FRONTEND_URL);
    }

    // Gerar Token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Setar Cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: isProduction, 
      sameSite: isProduction ? 'none' : 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    res.redirect(`${FRONTEND_URL}/dashboard`);
  })(req, res, next);
});
// Rota para pegar dados do usuário logado
app.get('/auth/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Sessão inválida' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sair' });
});

// ====================================================
// ROTAS DE AGENDAMENTO (BLINDADAS)
// ====================================================
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Acesso negado' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

  // PUBLIC BOOKINGS FOR CUSTOMERS (Home.jsx, Admin.jsx)
  app.post('/api/bookings', async (req, res) => {
    try {
      const { customerName, customerPhone, date, time } = req.body;
      const booking = await prisma.booking.create({
        data: { customerName, customerPhone, date: new Date(date), time }
      });
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao agendar' });
    }
  });

  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await prisma.booking.findMany({
        orderBy: { date: 'asc' }
      });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  });

  app.patch('/api/bookings/:id', async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await prisma.booking.update({
        where: { id: req.params.id },
        data: { status }
      });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar' });
    }
  });

app.post('/appointments', requireAuth, async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await prisma.appointment.create({
      data: { date: new Date(date), time, userId: req.userId }
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao agendar' });
  }
});

app.get('/appointments', requireAuth, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar' });
  }
});

app.delete('/appointments/:id', requireAuth, async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Cancelado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar' });
  }
});

// ====================================================
// BOAS-VINDAS E INÍCIO
// ====================================================
app.get('/', (req, res) => res.send('🚀 Backend Agendy-ai Online!'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: https://agendy-ai.onrender.com`);
});