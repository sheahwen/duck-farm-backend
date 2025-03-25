import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

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
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        res.status(400).json({
          error: "Invalid userId",
          message: "The provided userId does not exist.",
        });
        return;
      }
      console.error("Prisma known error", err.code, err.meta);
    } else {
      console.error("Unexpected error creating duck", err);
    }

    res.status(500).json({ error: "Error creating duck", details: err });
  }
});

router.get("/", async (req, res) => {
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
