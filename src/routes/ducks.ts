import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, description, userId } = req.body;
  try {
    const duck = await prisma.duck.create({
      data: {
        name,
        description,
        created_by: userId,
      },
    });
    res.json(duck);
  } catch (err) {
    res.status(500).json({ error: "Error creating duck", details: err });
  }
});

router.get("/", async (req, res) => {
  // res.json({ message: "hello" });
  try {
    const ducks = await prisma.duck.findMany({
      include: { user: true },
    });
    res.json(ducks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ducks", details: err });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const ducks = await prisma.duck.findMany({
      where: {
        created_by: userId,
      },
    });
    res.json(ducks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user's ducks", details: err });
  }
});

export default router;
