import express, { Request, Response } from "express";
import { Guard } from "@exmpl/models/Guard";
import { CreateGuard, DeleteGuard } from "@exmpl/services/guardService";

export const router = express.Router();

/*
    Routers for creating new guard and deleting
*/
router.post("/guards", async (req: Request, res: Response) => {
  try {
    const guard: Guard = req.body;
    const newEntry = await CreateGuard(guard);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).send("Failed to Create Guard");
  }
});

router.delete("/guards/:Name", async (req: Request, res: Response) => {
  const guardName = req.params.Name;
  DeleteGuard(guardName);
  res.status(200).send(`${guardName} deleted successfully`);
});
