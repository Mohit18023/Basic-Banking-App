import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router: Router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const { name, email, balance } = req.body;

  try {
    if (!name || !email || balance === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCustomer = await prisma.user.create({
      data: { name, email, balance: parseFloat(balance) },  // Ensure balance is a number
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Error creating customer' });
  }
});

export default router;
