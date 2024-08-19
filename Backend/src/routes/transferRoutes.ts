import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router: Router = Router();

// Get all transfer records
router.get('/records', async (req: Request, res: Response) => {
  try {
    const transfers = await prisma.transfer.findMany();
    res.json(transfers);
  } catch (err) {
    console.error("Error fetching transfer records:", err);
    res.status(500).json({ error: "Unable to fetch transfer records" });
  }
});

// Fetch transfer history for a specific user
router.get('/history/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

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

// Create a new transfer
router.post('/transfers', async (req: Request, res: Response) => {
  const { fromUserId, toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || amount == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const parsedFromUserId = parseInt(fromUserId);
  const parsedToUserId = parseInt(toUserId);

  if (isNaN(parsedFromUserId) || isNaN(parsedToUserId) || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const transfer = await prisma.$transaction(async (prisma) => {
      const fromUser = await prisma.user.update({
        where: { id: parsedFromUserId },
        data: { balance: { decrement: amount } },
      });

      if (fromUser.balance < 0) {
        throw new Error("Insufficient balance");
      }

      const toUser = await prisma.user.update({
        where: { id: parsedToUserId },
        data: { balance: { increment: amount } },
      });

      return prisma.transfer.create({
        data: {
          fromUserId: parsedFromUserId,
          toUserId: parsedToUserId,
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
