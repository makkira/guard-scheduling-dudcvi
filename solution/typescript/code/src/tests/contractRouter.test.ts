import request from "supertest";
import express from "express";
import { Contract } from "./../models/Contract";
import { router } from "../Routes/contractRouter";

/**
 * Building Test
 **/

const app = express();

app.use(express.json());
app.use("/api", router);
jest.setTimeout(10000);

const contracts: Contract[] = [];

test("POST /contracts should add a contract to the list of contracts", async () => {
  const contract: Contract = {
    ContractName: "Galaxy",
    DaysOfWeek: ["Monday", "Wednesday"],
    RequiresArmedGuard: false,
    StartDate: new Date(),
  };

  const response = await request(app).post("/api/contract").send(contract);
  expect(response.status).toBe(201);
  expect(response.text).toBe(
    `${
      contract.ContractName
    } created successfully on ${contract.StartDate.toDateString()}`
  );
});

test("DELETE /contract/:name should delete contract from list", async () => {
  const contract: Contract = {
    ContractName: "Galaxy",
    DaysOfWeek: ["Monday", "Wednesday"],
    RequiresArmedGuard: false,
    StartDate: new Date("2022-05-02"),
  };

  contracts.push(contract);

  const response = await request(app).delete(
    `/api/contract/${contract.ContractName}`
  );
  expect(response.status).toBe(201);
  expect(response.text).toBe(`${contract.ContractName} deleted successfully`);
});

test("DELETE /contract/:name should error 404 if contract is not in list", async () => {
  const contract: Contract = {
    ContractName: "Galaxy",
    DaysOfWeek: ["Monday", "Wednesday"],
    RequiresArmedGuard: false,
    StartDate: new Date("2022-05-02"),
  };

  const response = await request(app).delete(
    `/api/contract/${contract.ContractName}`
  );
  expect(response.status).toBe(404);
  expect(response.text).toBe(`${contract.ContractName} not found`);
});
