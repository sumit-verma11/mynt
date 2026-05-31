import { Router } from 'express';
import { getSettings, updateAccount, updateNotificationPrefs, updateReports, updateFilters, reconnectEmail } from '../data/settings.js';

const router = Router();

router.get('/', (req, res) => res.json(getSettings()));
router.put('/account', (req, res) => res.json(updateAccount(req.body)));
router.put('/notifications', (req, res) => res.json(updateNotificationPrefs(req.body)));
router.put('/reports', (req, res) => res.json(updateReports(req.body)));
router.put('/filters', (req, res) => res.json(updateFilters(req.body)));

router.post('/email/:id/reconnect', (req, res) => {
  const email = reconnectEmail(req.params.id);
  res.json(email || { error: 'Not found' });
});

router.put('/security/password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  res.json({ success: true });
});

router.post('/security/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  // Mock: in production this would trigger an SMS gateway
  res.json({ success: true, message: `OTP sent to ${phone}` });
});

export default router;
