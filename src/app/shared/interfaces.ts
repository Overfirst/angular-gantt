export interface GanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
  readyPercent: number;
}

export type GanttPeriod = 'day'| 'week' | 'month';