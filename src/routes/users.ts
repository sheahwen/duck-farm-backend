
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, email, created_by } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        created_by,
      },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error creating user', details: err });
  }
});

export default router;
