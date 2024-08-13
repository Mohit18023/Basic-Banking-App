import { Router } from 'express';

const router: Router = Router();
import { prisma } from '../prisma';
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
  res.json(user);
});

export default router;