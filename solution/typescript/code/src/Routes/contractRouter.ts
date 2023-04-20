import express, { Request, Response } from "express";
import { Contract } from "@exmpl/models/Contract";
import {
  CreateContract,
  DeleteContract,
} from "@exmpl/services/contractService";

export const router = express.Router();

/*
    Routers for creating new contract and deleting
*/
router.post("/contract", async (req: Request, res: Response) => {
  try {
    const contract: Contract = req.body;
    const newEntry = await CreateContract(contract);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).send("Failed to Create contract");
  }
});

router.delete("/contract/:Name", async (req: Request, res: Response) => {
  const contractName = req.params.Name;
  DeleteContract(contractName);
  res.status(200).send(`${contractName} deleted successfully`);
});
