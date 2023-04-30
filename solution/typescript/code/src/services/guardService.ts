import { Guard, GuardRequest } from "./../models/Guard";

export const guards: Guard[] = [];

export function CreateGuard(guardRequest: GuardRequest) {
  const guardIndex = guards.findIndex(
    (guard) => guardRequest.Name == guard.Name
  );

  if (guardIndex > -1) throw new Error(`${guardRequest.Name} already exists`);

  if (!isCorrectInput(guardRequest)) throw new Error(`Wrong input`);

  let guard: Guard = {
    Name: guardRequest.Name,
    HasArmedCredentials: guardRequest.HasArmedCredentials,
    Dates: [],
    HoursWorked: 0,
    WorkedDates: [],
  };
  guards.push(guard);
}

export function DeleteGuard(guardName: string) {
  const guardIndex = guards.findIndex((guard) => guardName == guard.Name);
  if (guardIndex > -1) {
    guards.splice(guardIndex, 1);
  } else {
    throw new Error(`${guardName} not found`);
  }
}

export function RequestPTO(guardName: string, date: Date) {
  // Check if guard exists
  const guardIndex = guards.findIndex((guard) => guardName == guard.Name);

  if (guardIndex < 0) throw new Error(`${guardName} doesn't exist`);

  if (guards[guardIndex] || guards[guardIndex].Dates) {
    const hasPTO = guards[guardIndex].Dates.some(
      (date) => date.getTime() === date.getTime()
    );

    if (hasPTO)
      throw new Error(
        `${guardName} has already requested PTO for ${date.toDateString()}`
      );
  }

  let updatedGuard = guards[guardIndex];
  if (!updatedGuard || !updatedGuard.Dates) {
    updatedGuard = { ...updatedGuard, Dates: [] };
  }

  updatedGuard.Dates.push(date);
  guards[guardIndex] = updatedGuard;
}

function isCorrectInput(guard: GuardRequest): boolean {
  if (guard.Name === "") return false;
  return true;
}
