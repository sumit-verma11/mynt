import { Router } from 'express';
import { categories, articles, getSystemStatus, submitTicket } from '../data/help.js';

const router = Router();

router.get('/categories', (req, res) => res.json(categories));

router.get('/articles', (req, res) => {
  const { categoryId, popular } = req.query;
  if (popular === 'true') return res.json(articles.filter(a => a.popular));
  if (categoryId) return res.json(articles.filter(a => a.categoryId === categoryId));
  res.json(articles);
});

router.get('/status', (req, res) => res.json(getSystemStatus()));

router.post('/ticket', (req, res) => {
  const ticket = submitTicket(req.body);
  res.status(201).json(ticket);
});

export default router;
