
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import {
  notFound,
  errorHandler
} from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
}));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SpendWise'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
