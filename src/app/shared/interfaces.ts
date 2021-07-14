export interface GanttTaskDependency {
  taskID: number;
  side: 'start' | 'end';
}

export interface GanttTask {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  readyPercent: number;
  color?: string;
  dependencies?: GanttTaskDependency[];
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

export interface TaskProgressInput {
  task: GanttTask;
  period: GanttPeriod;
  minDate: Date;
}