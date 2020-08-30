import express from 'express';

const router = express.Router();

router.get('/account/:userId', (req, res) => {
  const userId = req?.params?.userId;
  return res.json({ userId });
});

export default router;
