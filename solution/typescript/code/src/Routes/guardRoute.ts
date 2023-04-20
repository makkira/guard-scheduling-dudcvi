import express, { Request, Response } from "express";
import { Guard } from "@exmpl/models/Guard";
import { CreateGuard, DeleteGuard, guards } from "@exmpl/services/guardService";

export const router = express.Router();

router.post("/guards", async (req: Request, res: Response) => {
  try {
    const guard: Guard = req.body;
    const newEntry = await CreateGuard(guard);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).send("Failed to Create Guard");
  }
});

router.delete("/guards", async (req: Request, res: Response) => {
  const guardName = req.body.Name;
  DeleteGuard(guardName);
  res.status(200).send(`${guardName} deleted successfully`);
});
