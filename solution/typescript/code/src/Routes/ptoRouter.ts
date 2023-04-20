import express, { Request, Response } from "express";
import { RequestPTO } from "@exmpl/services/guardService";

export const router = express.Router();

/*
    Routers for requesting PTO
*/
router.post("/pto/:Name/:DayOff", async (req: Request, res: Response) => {
  try {
    const name = req.params.Name;
    const dayOff = req.params.DayOff;
    const newEntry = await RequestPTO(name, dayOff);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).send("Failed to request PTO");
  }
});
