import { Router } from 'express';
import { getBilling, updatePlanType, updateHistoricData, purchaseTokens, activateOutlet } from '../_data/billing.js';

const router = Router();

router.get('/', (req, res) => res.json(getBilling()));

router.put('/plan', (req, res) => res.json(updatePlanType(req.body.type)));

router.put('/historic-data', (req, res) => res.json(updateHistoricData(req.body.months)));

router.post('/tokens/purchase', (req, res) => res.json({ balance: purchaseTokens(req.body.packId) }));

router.put('/outlets/:id/activate', (req, res) => {
  const outlet = activateOutlet(req.params.id);
  res.json(outlet || { error: 'Not found' });
});

export default router;
