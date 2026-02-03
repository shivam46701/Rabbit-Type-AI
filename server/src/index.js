import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import passageRoutes from './routes/passages.js';
import metricsRoutes from './routes/metrics.js';
import textRoutes from './routes/text.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/passages', passageRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/text', textRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rabbit Type API is running!' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🐰 Rabbit Type server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('⚠️ MongoDB not available, running in demo mode');
    app.listen(PORT, () => {
      console.log(`🐰 Rabbit Type server running on http://localhost:${PORT} (Demo Mode)`);
    });
  }
};

startServer();
