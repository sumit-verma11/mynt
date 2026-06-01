import { Router } from 'express';
import { getBilling, updatePlanType, updateHistoricData, purchaseTokens, activateOutlet } from '../data/billing.js';

const router = Router();

router.get('/', (req, res) => res.json(getBilling()));

router.put('/plan', (req, res) => {
  const plan = updatePlanType(req.body.type);
  req.app.get('io')?.emit('billing:plan-update', plan);
  res.json(plan);
});

router.put('/historic-data', (req, res) => {
  const plan = updateHistoricData(req.body.months);
  req.app.get('io')?.emit('billing:plan-update', plan);
  res.json(plan);
});

router.post('/tokens/purchase', (req, res) => {
  const balance = purchaseTokens(req.body.packId);
  req.app.get('io')?.emit('billing:token-update', { balance });
  res.json({ balance });
});

router.put('/outlets/:id/activate', (req, res) => {
  const outlet = activateOutlet(req.params.id);
  res.json(outlet || { error: 'Not found' });
});

export default router;
