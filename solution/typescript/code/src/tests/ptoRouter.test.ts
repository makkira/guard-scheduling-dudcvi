import request from "supertest";
import express from "express";
import { Guard } from "../models/Guard";
import { router } from "../Routes/ptoRouter";
import { guards } from "./../services/guardService";

/**
 * Building Test
 **/

const app = express();

app.use(express.json());
app.use("/api", router);
jest.setTimeout(15000);

afterEach(() => {
  guards.length = 0; // Clear the guards array
});

test("POST /pto/:Name/:date should add a PTO request to a guard's record", async () => {
  const guard: Guard = {
    Name: "Jackson",
    HasArmedCredentials: false,
    Dates: [], // Initialize Dates with the PTO request
    HoursWorked: 0,
    WorkedDates: [],
  };
  guards.push(guard);

  const response = await request(app).post("/api/pto/Jackson/2022-05-02");
  expect(response.status).toBe(201);

  // Check that the guard's record was updated correctly
  const updatedGuard = guards.find((g) => g.Name === "Jackson");
  expect(updatedGuard).toBeDefined();
  expect(updatedGuard?.Dates).toContainEqual(new Date("2022-05-02"));
});

test("POST /pto/:Name/:date should error 404 if guard is not in list", async () => {
  const response = await request(app).post("/api/pto/Jackson/2022-05-02");

  expect(response.status).toBe(404);
  expect(response.text).toBe("Jackson doesn't exist");
});

test("POST /pto/:Name/:date should error 404 if guard already requested PTO", async () => {
  const guard: Guard = {
    Name: "Jackson",
    HasArmedCredentials: false,
    Dates: [new Date("2022-05-02")], // Initialize Dates with the PTO request
    HoursWorked: 0,
    WorkedDates: [],
  };

  guards.push(guard);
  const date = new Date("2022-05-02");

  const response = await request(app).post("/api/pto/Jackson/2022-05-02");
  expect(response.status).toBe(404);
  expect(response.text).toBe(
    `${guard.Name} has already requested PTO for ${date.toDateString()}`
  );
});
