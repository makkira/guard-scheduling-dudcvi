// import { request } from "supertest";
import { Guard } from "./../models/Guard";
import { generateSchedule } from "./../services/scheduleService";
import { guards } from "./../services/guardService";
import { contracts } from "./../services/contractService";
import { Contract } from "./../models/Contract";
import { ShiftResponse } from "./../models/Schedule";

describe("scheduleService tests", () => {
  beforeEach(() => {
    guards.length = 0;
    contracts.length = 0;
  });

  it("should return 'no guards available...'", () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    const testGuard: Guard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard);

    const test_contract: Contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday"],
      RequiresArmedGuard: true,
      StartDate: new Date(2023, 3, 30),
    };

    contracts.push(test_contract);

    // Call the function and check that it returns a schedule with the assigned guard
    const generateScheduleWithParams = () => generateSchedule(start, end);
    expect(generateScheduleWithParams).toThrow(
      "No guards available for shift on Mon May 01 2023 for contract test_contract"
    );
  });

  it("should return 'no shifts available...''", () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    const testGuard: Guard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard);

    const test_contract: Contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday"],
      RequiresArmedGuard: true,
      StartDate: new Date(2023, 4, 8),
    };

    contracts.push(test_contract);

    // Call the function and check that it returns a schedule with the assigned guard
    const generateScheduleWithParams = () => generateSchedule(start, end);
    expect(generateScheduleWithParams).toThrow(
      "No shifts available for Mon May 01 2023 to Sun May 07 2023"
    );
  });

  it("should return schedule with one shift | one guard, one contract", () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    const testGuard: Guard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard);

    const test_contract: Contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday"],
      RequiresArmedGuard: false,
      StartDate: new Date(2023, 3, 30),
    };

    contracts.push(test_contract);

    const shift: ShiftResponse = {
      Day: new Date(2023, 4, 1),
      Contract: "test_contract",
      Name: "test_1",
    };

    const expectedSchedule: ShiftResponse[] = [shift];

    // Call the function and check that it returns a schedule with the assigned guard
    const schedule = generateSchedule(start, end);
    expect(schedule).toEqual(expectedSchedule);
  });

  it("should return schedule with five shifts  | one guard, one contract", () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 30);

    const testGuard: Guard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard);

    const test_contract: Contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday"],
      RequiresArmedGuard: false,
      StartDate: new Date(2023, 3, 30),
    };

    contracts.push(test_contract);

    const expectedSchedule: ShiftResponse[] = [
      {
        Day: new Date(2023, 4, 1), // May 1
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 8), // May 8
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 15), // May 15
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 22), // May 22
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 29), // May 29
        Contract: "test_contract",
        Name: "test_1",
      },
    ];

    // Call the function and check that it returns a schedule with the assigned guard
    const schedule = generateSchedule(start, end);

    expect(schedule).toEqual(expectedSchedule);
  });

  it("should return schedule with two shifts assigned to two guards | two guards, one contract", () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    const testGuard1: Guard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    const testGuard2: Guard = {
      Name: "test_2",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard1);
    guards.push(testGuard2);

    const test_contract: Contract = {
      ContractName: "test_contract",
      DaysOfWeek: ["Monday", "Wednesday"],
      RequiresArmedGuard: false,
      StartDate: new Date(2023, 3, 30),
    };

    contracts.push(test_contract);

    const expectedSchedule: ShiftResponse[] = [
      {
        Day: new Date(2023, 4, 1),
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 3),
        Contract: "test_contract",
        Name: "test_2",
      },
    ];

    // Call the function and check that it returns a schedule with the assigned guard
    const schedule = generateSchedule(start, end);
    expect(schedule).toEqual(expectedSchedule);
  });

  it("should return schedule with two shifts assigned to one guard guards | two guards, one contract", () => {
    let start = new Date(2023, 4, 1);
    let end = new Date(2023, 4, 7);

    const testGuard1: Guard = {
      Name: "test_1",
      HasArmedCredentials: false,
      Dates: [],
      HoursWorked: 0,
      WorkedDates: [],
    };

    const testGuard2: Guard = {
      Name: "test_2",
      HasArmedCredentials: false,
      Dates: [
        new Date(2023, 4, 1),
        new Date(2023, 4, 2),
        new Date(2023, 4, 3),
        new Date(2023, 4, 4),
      ],
      HoursWorked: 0,
      WorkedDates: [],
    };

    guards.push(testGuard1);
    guards.push(testGuard2);

    const test_contract1: Contract = {
      ContractName: "test_contract",
      DaysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      RequiresArmedGuard: false,
      StartDate: new Date(2023, 3, 30),
    };

    contracts.push(test_contract1);

    const expectedSchedule: ShiftResponse[] = [
      {
        Day: new Date(2023, 4, 1),
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 2),
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 3),
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 4),
        Contract: "test_contract",
        Name: "test_1",
      },
      {
        Day: new Date(2023, 4, 5),
        Contract: "test_contract",
        Name: "test_2",
      },
      {
        Day: new Date(2023, 4, 6),
        Contract: "test_contract",
        Name: "test_2",
      },
    ];

    // Call the function and check that it returns a schedule with the assigned guard
    const schedule = generateSchedule(start, end);
    expect(schedule).toEqual(expectedSchedule);
  });
});
