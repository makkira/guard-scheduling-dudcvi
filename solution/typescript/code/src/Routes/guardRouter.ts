import express, { Request, Response } from "express";
import { Guard } from "./../models/Guard";
import { CreateGuard, DeleteGuard } from "./../services/guardService";

export const router = express.Router();

/*
    Routers for creating new guard and deleting
*/
router.post("/guards", async (req: Request, res: Response) => {
  try {
    const guard: Guard = req.body;
    CreateGuard(guard);
    res.status(201).send(`${guard.Name} created successfully`);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

router.delete("/guards/:name", async (req: Request, res: Response) => {
  try {
    const guardName = req.params.name;
    DeleteGuard(guardName);
    res.status(201).send(`${guardName} deleted successfully`);
  } catch (err: any) {
    res.status(404).send(err.message);
  }
});

export default router;
