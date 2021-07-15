export interface GanttTaskDependency {
  fromID: number;
  toID: number;
}

export interface GanttTask {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  readyPercent: number;
  color?: string;
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
  taskInfo: { task: GanttTask; rowID: number; };
  period: GanttPeriod;
  minDate: Date;
}

export interface GanttScrollSyncEvent {
  scrollValue: number;
}


export interface TaskTimelineData {
  taskID: number;
  rowID: number;
  width: number;
  offset: number;
}

export interface GanttDependenciesData {
  tasksInfo: TaskTimelineData[];
  dependencies: GanttTaskDependency[];
  period: GanttPeriod;
}