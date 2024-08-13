import { Router } from 'express';
import { prisma } from '../prisma';

const router: Router = Router();

router.post('/create', async (req, res) => {
  const { name, email, balance } = req.body;
  console.log(req.body);

  try {
    const newCustomer = await prisma.user.create({
      data: { name, email, balance },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Error creating customer' });
  }
});

export default router;
