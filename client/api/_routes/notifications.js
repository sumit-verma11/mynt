import { Router } from 'express';
import { getNotifications, markRead, markAllRead, deleteNotification } from '../_data/notifications.js';

const router = Router();

router.get('/', (req, res) => res.json(getNotifications()));

router.put('/read-all', (req, res) => {
  const all = markAllRead();
  res.json(all);
});

router.put('/:id/read', (req, res) => {
  const n = markRead(req.params.id);
  if (!n) return res.status(404).json({ error: 'Not found' });
  res.json(n);
});

router.delete('/:id', (req, res) => {
  deleteNotification(req.params.id);
  res.json({ success: true });
});

export default router;
