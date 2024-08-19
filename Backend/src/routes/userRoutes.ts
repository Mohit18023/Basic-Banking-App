import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router: Router = Router();

// Fetch all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

// Fetch a specific user by ID
router.get('/get/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(`Error fetching user with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Unable to fetch user' });
  }
});

export default router;
