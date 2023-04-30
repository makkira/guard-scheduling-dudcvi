export interface ShiftResponse {
  Day: string;
  Contract: string;
  Name: string;
}

export interface Shift {
  Day: Date;
  Contract: string;
  Name: string;
  RequiresArmed: boolean;
  IsAssigned: boolean;
}
