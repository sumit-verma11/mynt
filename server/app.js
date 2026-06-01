import express from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notifications.js';
import billingRoutes from './routes/billing.js';
import settingsRoutes from './routes/settings.js';
import helpRoutes from './routes/help.js';

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/notifications', notificationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/help', helpRoutes);

export default app;
