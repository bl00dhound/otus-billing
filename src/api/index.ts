import express from 'express';

import AccountService from '../services/account';

const router = express.Router();

router.get('/account/:userId', async (req, res) => {
  const userId = req?.params?.userId || 0;
  const balance = await AccountService.getBalance(Number(userId));
  return res.json(balance);
});

export default router;
