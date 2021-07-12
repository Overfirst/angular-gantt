export interface GanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
  readyPercent: number;
}

export type GanttPeriod = 'Day'| 'Week' | 'Month';

export interface PeriodSettings {
  name: GanttPeriod;
  title: string;
}

export interface PeriodPart {
  main: Date,
  detail: Date[]
}