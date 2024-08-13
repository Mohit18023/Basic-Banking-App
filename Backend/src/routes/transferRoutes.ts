import { Router } from 'express';
import { prisma } from '../prisma';
const router: Router = Router();


router.post('/transfers', async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  const fromUser = await prisma.user.update({
    where: { id: fromUserId },
    data: { balance: { decrement: amount } },
  });

  const toUser = await prisma.user.update({
    where: { id: toUserId },
    data: { balance: { increment: amount } },
  });

  const transfer = await prisma.transfer.create({
    data: {
      fromUserId,
      toUserId,
      amount,
    },
  });

  res.json(transfer);
});

export default router;