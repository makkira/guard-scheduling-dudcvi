/**
 *
 * @param scheduleStart
 * @param contractStart
 * @returns the difference between two dates
 */
export function difference(scheduleStart: Date, contractStart: Date): number {
  if (!scheduleStart || !contractStart) {
    throw new Error("Both dates must be defined");
  }

  const date1 = new Date(
    scheduleStart.getFullYear(),
    scheduleStart.getMonth(),
    scheduleStart.getDate()
  );

  const date2 = new Date(
    contractStart.getFullYear(),
    contractStart.getMonth(),
    contractStart.getDate()
  );

  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 *
 * @param date
 * @returns a more normalized date for the purposes of locally running the API.
 */
export function getDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
