import express from 'express';
import cors from 'cors';
import notificationRoutes from './_routes/notifications.js';
import billingRoutes from './_routes/billing.js';
import settingsRoutes from './_routes/settings.js';
import helpRoutes from './_routes/help.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/help', helpRoutes);

export default app;
