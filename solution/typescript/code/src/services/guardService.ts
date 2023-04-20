import { Guard } from "./../models/Guard";

export const guards: Guard[] = [];
export const pto: PTO[] = [];

export function CreateGuard(guard: Guard) {
  if (guard) {
    guards.push(guard);
  } else {
    throw new Error(`Wrong input`);
  }
}

export function DeleteGuard(guardName: string) {
  const guardIndex = guards.findIndex((guard) => guardName == guard.Name);
  if (guardIndex > -1) {
    guards.splice(guardIndex, 1);
  } else {
    throw new Error(`${guardName} not found`);
  }
}

// TODO: Check if guard exists
export function RequestPTO(guardName: string, dayOfWeek: string) {
  const guardIndex = pto.findIndex((scheduled) => guardName == scheduled.Name);
  if (guardIndex > -1) {
    throw new Error(`${guardName} already sheduled PTO`);
    guards.splice(guardIndex, 1);
  } else {
    let newPto: PTO = {
      Name: guardName,
      DayOff: dayOfWeek,
    };

    pto.push(newPto);
  }
}
