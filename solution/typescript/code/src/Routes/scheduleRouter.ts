import { generateSchedule } from "./../services/scheduleService";
import express, { Request, Response } from "express";

export const router = express.Router();

router.get("/schedule/:start/:end", async (req: Request, res: Response) => {
  try {
    const startDate = new Date(req.params.start);
    const endDate = new Date(req.params.end);
    const schedule = generateSchedule(startDate, endDate);
    res.status(201).json(schedule);
  } catch (err: any) {
    res.status(404).send(err.message);
  }
});
