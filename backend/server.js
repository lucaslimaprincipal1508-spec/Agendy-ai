const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => res.json({ message: 'AGENDY.AI Backend Online!' }));

// GET /api/bookings - List all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings - Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await prisma.booking.create({
      data: req.body
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/bookings/:id - Update status
app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 AGENDY.AI rodando na porta ${PORT}`));

