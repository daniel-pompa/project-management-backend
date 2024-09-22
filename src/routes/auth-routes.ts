import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('from /api/auth');
});

export default router;
