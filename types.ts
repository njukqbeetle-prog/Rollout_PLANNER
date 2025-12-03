export interface CellStyle {
  backgroundColor: string;
  colSpan?: number;
}

export interface ScheduleRow {
  activity: string;
  cells: (CellStyle | null)[]; // Array of 6 days (null means empty/white)
}

export interface LegendItem {
  color: string;
  label: string;
}

export interface WeekData {
  weekNumber: number;
  title: string;
  branchesInvolved: number[];
  rows: ScheduleRow[];
  legends: LegendItem[];
}

export interface RolloutConfig {
  companyName: string;
  projectName: string;
  numBranches: number;
  startDate: string;
}
