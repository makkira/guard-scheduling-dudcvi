import express, { Request, Response } from "express";
import { RequestPTO } from "./../services/guardService";

export const router = express.Router();

router.post("/pto/:Name/:date", async (req: Request, res: Response) => {
  const name = req.params.Name;
  const date = new Date(req.params.date);
  try {
    RequestPTO(name, date);
    res
      .status(201)
      .send(`PTO for ${name}: ${date.toDateString()} created successfully`);
  } catch (err: any) {
    res.status(404).send(err.message);
  }
});
