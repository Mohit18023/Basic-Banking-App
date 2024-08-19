import { Router } from 'express';
import { prisma } from '../prisma';
import { where } from 'sequelize';

const router: Router = Router();

router.get('/records', async (req, res) => {
  
  try {
    const transfers = await prisma.transfer.findMany();
    
    res.json(transfers);
  } catch (err) {
    
    res.status(500).json({ error: "Unable to fetch transfer records" });
  }
});

// Fetch transfer history for a specific user
router.get('/history/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const history = await prisma.transfer.findMany({
      where: {
        OR: [
          { toUserId: userId },
          { fromUserId: userId }
        ]
      }
    });

    res.json(history);
  } catch (err) {
    console.error("Error fetching transfer history:", err);
    res.status(500).json({ error: "Unable to fetch transfer history" });
  }
});

router.post('/transfers', async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  // Basic validation
  if (!fromUserId || !toUserId || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Using a transaction to ensure atomicity
    const transfer = await prisma.$transaction(async (prisma) => {
      const fromUser = await prisma.user.update({
        where: { id: fromUserId },
        data: { balance: { decrement: amount } },
      });

      const toUser = await prisma.user.update({
        where: { id: toUserId },
        data: { balance: { increment: amount } },
      });

      return prisma.transfer.create({
        data: {
          fromUserId,
          toUserId,
          amount,
        },
      });
    });

    res.json(transfer);
  } catch (err) {
    console.error("Error processing transfer:", err);
    res.status(500).json({ error: "Unable to process transfer" });
  }
});

export default router;
