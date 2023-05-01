# Implementation Details

## Asumptions Made

- `/schedule` user will not request overlapping dates.
- There cannot be multiple guards with the same name.
- There cannot be multiple contracts with the same name.
- Contracts can start at any time.
- Guards with armed license can be assigned to any contract.
- Deleted contracts cannot be scheduled for any shift.

## Futre Potential Improvements

### Design Improvements

- Allow the user to update a schedule.
- Allow user to modify a contract.
- Allow user to update Guard license information and the date of the update.

### Technical Improvements

- Store data in a database instead of locally.
- Keep track of the date contracts were deleted and assign shifts until deletion date.
- Change tests to be consistent in their set up.
- Create a seperate file for mock data for readability of the code.
- For repeated code, create a function for re-use.
- Define type for each applicable variable.

## Scheduling Algorithm Explanation

### Overview of Algorithm

#### Before we start assigning shifts

- Grab only the contracts that start before or on the given end date.
- Create all available shifts with the requirements.
- Assign each shift to guards by:
  - Checking if they are available on `shift.day` considering license and PTO.
  - Grabbing the guard with the least overtime or the least hours worked.

### Detailed Explanation

The heart of the algorithm lies in the `CalculateWeeklyOvertime` function.

It assumes that there's no "beginning to the work week" and rather compares the dates the guard has worked in a 7-day period and if they're consecutive. Using `weeklyShifts`, we grab all the shifts the guard has been assigned and only grab those in the past 7 days. We then go through all the shifts starting with the most recent one and make sure that none of them are older than 7 days.

If the guard has worked the past week, we add their hours up and then, we check if the guard has worked 7 consecutive days and caclulate their overtime. Once that's done, we return the overtime hours to `getAvailableGuards` which sorts the eligible guards based on their overtime hours and hours worked.

After that, we return the guard who meets all the requirements and is the best option to be assigned.
