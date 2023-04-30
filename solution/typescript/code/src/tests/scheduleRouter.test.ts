import { generateSchedule } from "./../services/scheduleService";
import { router } from "./../Routes/scheduleRouter";
import express, { Request } from "express";
import request from "supertest";
import { guards } from "./../services/guardService";
import { contracts } from "./../services/contractService";

describe("schedule router", () => {
  beforeEach(() => {
    guards.length = 0;
    contracts.length = 0;
  });

  it("should return a schedule", async () => {
    const startDate = "2023-05-01T00:00:00Z";
    const endDate = "2023-05-10T00:00:00Z";

    const contract1 = {
      ContractName: "Test Contract1",
      DaysOfWeek: ["Monday"],
      StartDate: new Date("2023-05-08T00:00:00"),
      RequiresArmedGuard: false,
    };

    contracts.push(contract1);

    // Create a guard with availability on the same day of the week
    const guard = {
      Name: "Test Guard",
      HasArmedCredentials: true,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(guard);

    const expectedSchedule = [
      {
        Day: "5/8/2023",
        Contract: "Test Contract1",
        Name: "Test Guard",
      },
      // Add more expected schedule entries here
    ];

    const app = express();
    app.use(express.json());
    app.use("/", router);

    const response = await request(app)
      .get(`/schedule/${startDate}/${endDate}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expectedSchedule);
  });

  it("should return 404", async () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    const testGuard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard);

    const test_contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday"],
      RequiresArmedGuard: true,
      StartDate: new Date(2023, 3, 30),
    };

    contracts.push(test_contract);

    const app = express();
    app.use(express.json());
    app.use("/", router);

    const response = await request(app)
      .get(`/schedule/${start}/${end}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.text).toEqual(
      "No guards available for shift on Mon May 01 2023 for contract test_contract"
    );
  });

  it("should return 'no shifts available...''", async () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    let testGuard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard);

    let test_contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday"],
      RequiresArmedGuard: true,
      StartDate: new Date(2023, 4, 8),
    };

    contracts.push(test_contract);

    const app = express();
    app.use(express.json());
    app.use("/", router);

    const response = await request(app)
      .get(`/schedule/${start}/${end}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.text).toEqual(
      "No shifts available for Mon May 01 2023 to Sun May 07 2023"
    );
  });
});
