export interface GanttTaskDependency {
  fromID: number;
  toID: number;
}

export interface GanttTask {
  ID: number;
  parentID?: number | null;
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
  marginTop: number;
}

export interface GanttScrollSyncEvent {
  scrollValue: number;
}


export interface TaskTimelineData {
  taskID: number;
  rowID: number;
  width: number;
  offset: number;
  marginTop: number;
}

export interface GanttDependenciesData {
  tasksInfo: TaskTimelineData[];
  dependencies: GanttTaskDependency[];
  period: GanttPeriod;
}

export interface GanttLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hasArrow?: boolean;
}

export interface GanttTaskRow {
  task: GanttTask;
  childs?: GanttTaskRow[];
  opened?: boolean;
}