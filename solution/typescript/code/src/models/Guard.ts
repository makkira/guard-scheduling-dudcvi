export interface GuardRequest {
  Name: string;
  HasArmedCredentials: boolean;
}

export interface Guard {
  Name: string;
  HasArmedCredentials: boolean;
  Dates: Date[];
  HoursWorked: number;
  WorkedDates: Date[];
}
