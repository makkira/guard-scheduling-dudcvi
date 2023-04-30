import express, { Request, Response } from "express";
import { Contract } from "./../models/Contract";
import { CreateContract, DeleteContract } from "./../services/contractService";

export const router = express.Router();

/*
    Routers for creating new contract and deleting
*/
router.post("/contract", async (req: Request, res: Response) => {
  try {
    const contract: Contract = req.body;
    contract.StartDate = new Date();
    CreateContract(contract);
    res
      .status(201)
      .send(
        `${
          contract.ContractName
        } created successfully on ${contract.StartDate.toDateString()}`
      );
  } catch (err: any) {
    res.status(401).send(err.message);
  }
});

router.delete("/contract/:name", async (req: Request, res: Response) => {
  try {
    const contractName = req.params.name;
    DeleteContract(contractName);
    res.status(201).send(`${contractName} deleted successfully`);
  } catch (err: any) {
    res.status(404).send(err.message);
  }
});

export default router;
