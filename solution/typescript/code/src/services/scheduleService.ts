import { Contract } from "./../models/Contract";
import { Guard } from "./../models/Guard";
import { guards } from "./guardService";
import { contracts } from "./contractService";
import { difference, getDate } from "./../utils/dateUtil";
import { Shift, ShiftResponse } from "./../models/Schedule";

interface WeeklySchedule {
  [guardName: string]: Shift[];
}

export function generateSchedule(start: Date, end: Date): ShiftResponse[] {
  const guardsAvailability = guardsAvailabilityMap(guards, start, end);
  const schedule: ShiftResponse[] = [];
  const weeklySchedule: WeeklySchedule = {};

  // Get all the contracts that start before the end date or on the end date.
  let contractsInRange = contracts.filter(
    (contract) => contract.StartDate <= end
  );

  if (contractsInRange.length === 0)
    throw new Error(
      `No shifts available for ${start.toDateString()} to ${end.toDateString()}`
    );

  const shifts = getShifts(start, end, contractsInRange);

  for (const shift of shifts) {
    if (shift.IsAssigned) continue;

    // dayIndex is to quickly reference a guard's availability
    const dayIndex = difference(start, shift.Day);

    let guard: Guard | null = assignShiftToGuard(
      shift,
      guardsAvailability,
      weeklySchedule,
      dayIndex
    );

    if (!guard) {
      throw new Error(
        `No guards available for shift on ${shift.Day.toDateString()} for contract ${
          shift.Contract
        }`
      );
    }

    shift.IsAssigned = true;
    shift.Name = guard.Name;

    const assignedShift: ShiftResponse = {
      Day: getDate(shift.Day).toLocaleDateString("en-US").substring(0, 10),
      Contract: shift.Contract,
      Name: shift.Name,
    };

    schedule.push(assignedShift);

    guardsAvailabilityMapUpdate(guardsAvailability, guard, dayIndex);
  }

  return schedule;
}

function getShifts(start: Date, end: Date, contracts: Contract[]) {
  const shifts: Shift[] = [];
  contracts.forEach((contract) => {
    const startDay = getDate(contract.StartDate);

    // Looping through each week from the start date
    for (let day = startDay; day <= end; day.setDate(day.getDate() + 1)) {
      const newDay = getDate(day);
      // if day matches schedule, add shift
      if (
        contract.DaysOfWeek.includes(
          newDay.toLocaleDateString("en-US", { weekday: "long" })
        )
      ) {
        let shift: Shift = {
          Day: newDay,
          Contract: contract.ContractName,
          Name: "",
          RequiresArmed: contract.RequiresArmedGuard,
          IsAssigned: false,
        };

        shifts.push(shift);
      }
    }
  });

  return shifts;
}

/**
 * Creates a map of guard name to a list of boolean values.
 * The list of boolean values indicates whether or not a guard is able to work on that day.
 */
function guardsAvailabilityMap(
  guards: Guard[],
  start: Date,
  end: Date
): Record<string, boolean[]> {
  const guardAvailabilityMap: Record<string, boolean[]> = {};

  for (const guard of guards) {
    guardAvailabilityMap[guard.Name] = [];

    // for every date between the start date and end date....
    for (
      let date = getDate(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date.toISOString().slice(0, 10);

      if (
        guard.Dates.some((d) => d.toISOString().slice(0, 10) === dateString)
      ) {
        guardAvailabilityMap[guard.Name].push(false);
      } else {
        guardAvailabilityMap[guard.Name].push(true);
      }
    }
  }

  return guardAvailabilityMap;
}

/**
 * Once a guard is assigned a shift, this updates the map to indicate that the guard is no longer available.
 */
function guardsAvailabilityMapUpdate(
  guardsAvailability: Record<string, boolean[]>,
  guard: Guard,
  dayIndex: number
) {
  guardsAvailability[guard.Name][dayIndex] = false;
}

function assignShiftToGuard(
  shift: Shift,
  guardsAvailability: Record<string, boolean[]>,
  weeklySchedule: WeeklySchedule,
  dayIndex: number
): Guard | null {
  // first, get the list of available guards sorted by
  // least overtime hours to most
  const availableGuards = getAvailableGuards(
    shift,
    weeklySchedule,
    guardsAvailability,
    dayIndex
  );

  // If there are no available guards, return null
  if (availableGuards.length === 0) {
    return null;
  }

  // Otherwise, assign the shift to the guard with the least overtime hours
  const guard = availableGuards[0];
  guard.HoursWorked += 10;
  guard.WorkedDates.push(shift.Day);

  // Add the shift to the guard's weekly schedule
  if (!weeklySchedule[guard.Name]) {
    weeklySchedule[guard.Name] = [];
  }
  weeklySchedule[guard.Name].push(shift);

  // Return the assigned guard
  return guard;
}

function getAvailableGuards(
  shift: Shift,
  weeklySchedule: WeeklySchedule,
  guardsAvailability: Record<string, boolean[]>,
  dateIndex: number
): Guard[] {
  const { RequiresArmed } = shift;

  // filter guards by whether they are available on the day of the shift
  // or if they do not have a license to be armed when the contract requires them to
  const availableGuards = guards.filter((guard) => {
    if (!guardsAvailability[guard.Name][dateIndex]) return false;

    if (RequiresArmed && !guard.HasArmedCredentials) return false;

    return true;
  });

  // grabs the overtime hours for the guards and sorts them from least to most
  // if there's a tie, we sort by the amount of hours worked
  availableGuards.sort((a, b) => {
    const overtimeDiff =
      calculateWeeklyOvertime(a, shift.Day, weeklySchedule) -
      calculateWeeklyOvertime(b, shift.Day, weeklySchedule);
    if (overtimeDiff === 0) {
      return a.HoursWorked - b.HoursWorked;
    }
    return overtimeDiff;
  });

  return availableGuards;
}

function calculateWeeklyOvertime(
  guard: Guard,
  shiftDate: Date,
  weeklySchedule: WeeklySchedule
): number {
  // Get the shifts assigned to the guard for the current week
  const shifts = weeklySchedule[guard.Name] ?? [];

  // Calculate the overtime hours for the guard over the last 7 days
  let overtime = 0;
  let contiguousHoursWorked = 0;
  let daysWorked: string[] = [];

  const dayOfWeek = shiftDate.getDay();
  const currentWeekStart = getDate(shiftDate);
  currentWeekStart.setDate(shiftDate.getDate() - dayOfWeek);

  // this block calculates the overtime hours
  for (let i = shifts.length - 1; i >= 0; i--) {
    const shift = shifts[i];
    const shiftDate = new Date(shift.Day);
    if (shiftDate < currentWeekStart) {
      break;
    }
    if (guard.WorkedDates.includes(shiftDate)) {
      contiguousHoursWorked += 10;
      if (!daysWorked.includes(shiftDate.toISOString())) {
        daysWorked.push(shiftDate.toISOString());
      }
    } else {
      if (daysWorked.length === 7) {
        overtime += Math.max(contiguousHoursWorked - 40, 0);
      }
      contiguousHoursWorked = 0;
      daysWorked = [];
    }
  }

  if (daysWorked.length === 7) {
    overtime += Math.max(contiguousHoursWorked - 40, 0);
  }
  return overtime;
}
