import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import notificationRoutes from './routes/notifications.js';
import billingRoutes from './routes/billing.js';
import settingsRoutes from './routes/settings.js';
import helpRoutes from './routes/help.js';
import { generateRandomNotification } from './data/notifications.js';
import { getSystemStatus } from './data/help.js';

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.set('io', io);

app.use('/api/notifications', notificationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/help', helpRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('system:status', getSystemStatus());
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// New notification every 2 minutes
setInterval(() => {
  const n = generateRandomNotification();
  io.emit('notification:new', n);
  console.log('[RT] New notification:', n.title);
}, 120000);

// System status refresh every 15 seconds
setInterval(() => {
  io.emit('system:status', getSystemStatus());
}, 15000);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`mynt server → http://localhost:${PORT}`));
