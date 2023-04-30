import request from "supertest";
import express from "express";
import { Guard, GuardRequest } from "../models/Guard";
import { router } from "../Routes/guardRouter";

/**
 * Building Test
 **/

const app = express();

app.use(express.json());
app.use("/api", router);
jest.setTimeout(10000);

const guards: GuardRequest[] = [];

test("POST /guards should add a guard to the list of guards", async () => {
  const guard: GuardRequest = {
    Name: "Jackson",
    HasArmedCredentials: false,
  };
  const response = await request(app).post("/api/guards").send(guard);
  expect(response.status).toBe(201);
  expect(response.text).toBe(`${guard.Name} created successfully`);
});

test("DELETE /guards/:Name should delete guard from list", async () => {
  const guard: GuardRequest = {
    Name: "Jackson",
    HasArmedCredentials: false,
  };
  guards.push(guard);

  const response = await request(app).delete(`/api/guards/${guard.Name}`);
  expect(response.status).toBe(201);
  expect(response.text).toBe(`${guard.Name} deleted successfully`);
});

test("DELETE /guards/:Name should error 404 if guard is not in list", async () => {
  const guard: GuardRequest = {
    Name: "Jackson",
    HasArmedCredentials: false,
  };

  const response = await request(app).delete(`/api/guards/${guard.Name}`);
  expect(response.status).toBe(404);
  expect(response.text).toBe(`${guard.Name} not found`);
});
