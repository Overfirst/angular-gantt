import { Injectable } from '@angular/core';
import { GanttDependenciesData, GanttLine, GanttPeriod, GanttTask, GanttTaskDependency, GanttTaskRemoveData, GanttTaskRow, PeriodPart, TaskTimelineData } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class GanttService {
  public readonly rowHeight = 40;
  public readonly taskProgressHeight = 10;

  public getTasksRows(tasks: GanttTask[], oldTasksRows: GanttTaskRow[]): GanttTaskRow[] {
    const oldAllTaskRows = this.getAllRows(oldTasksRows);

    const createTasksRows = (tasks: GanttTask[], parentID: number | null): GanttTaskRow[] => {
      const rows: GanttTaskRow[] = [];

      tasks.forEach(task => {
        if (task.parentID === undefined) {
          task.parentID = null;
        }

        const oldTaskRow = oldAllTaskRows.find(taskRow => taskRow.task.ID === task.ID);

        if (task.parentID === parentID) {
          rows.push({
            task,
            childs: createTasksRows(tasks, task.ID),
            opened: oldTaskRow?.opened || false
          });
        }
      });      

      return rows;
    };

    return createTasksRows(tasks, null);
  }

  public weekEnd(date: Date): Date {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6 - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    return endDate;
  }

  public addWeekForMonth(date: Date): Date {
    const newDate = new Date(date);
    const totalDays = this.daysInMonth(date);
    const addition = newDate.getDate() + 6;

    if (addition < totalDays) {
      newDate.setDate(addition);
    } else {
      newDate.setDate(totalDays);
    }

    return newDate;
  }

  public daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  public addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  public getMonthWeekCapacity(date: Date): number {
    const newDate = new Date(date);

    const totalDays = this.daysInMonth(newDate);
    const addition = newDate.getDate();

    if (addition + 6 >= totalDays) {
      return totalDays - addition + 1;
    }

    return 7;
  }

  public calculatePeriodParts(period: GanttPeriod, tasks: GanttTask[]): PeriodPart[] {
    const { minDate, maxDate } = this.getDateLimits(tasks);

    const periodParts: PeriodPart[] = [];
    let different;

    switch (period) {
      case 'Day':
        different = this.datesDifferent(minDate, maxDate, period);
        this.partsForDay(different, minDate, periodParts);
        break;
      case 'Week':
        different = this.datesDifferent(this.weekStart(minDate), this.weekEnd(maxDate), period);
        this.partsForWeek(different, minDate, periodParts);
        break;
      case 'Month':
        different = this.datesDifferent(minDate, maxDate, period);
        this.partsForMonth(different, minDate, periodParts);
        break;
    }

    return periodParts;
  }

  public colspanForHeader(period: GanttPeriod, date: Date): number {
    switch (period) {
      case 'Day':
        return 24;
      case 'Week':
        return 7;
      case 'Month':
        return this.daysInMonth(date);
    }
  }

  public colspanForDetail(period: GanttPeriod, date: Date): number {
    switch (period) {
      case 'Day':
      case 'Week':
        return 1;
      case 'Month':
        return this.getMonthWeekCapacity(date);
    }
  }

  public computeDateOffset(date: Date, period: GanttPeriod, minDate: Date): number {
    let result: number;

    switch (period) {
      case 'Day':
        result = this.getDifferentHours(date, minDate);
        break;
      case 'Week':
        result = this.getDifferentDays(date, minDate);
        break
      case 'Month':
        result = this.getDifferentWeeks(date, minDate);
        break;
    }

    return result * 100;
  }

  public computeTaskProgressWidth(task: GanttTask, period: GanttPeriod): number {
    let result: number;

    switch (period) {
      case 'Day':
        result = this.getDifferentHours(task.startDate, task.endDate);
        break;
      case 'Week':
        result = this.getDifferentDays(task.startDate, task.endDate);
        break
      case 'Month':
        result = this.getDifferentWeeks(task.startDate, task.endDate);
        break;
    }

    return result * 100;
  }

  public computeDependencies(data: GanttDependenciesData): GanttLine[] {
    let firstLineWidth: number;

    switch (data.period) {
      case 'Day':
        firstLineWidth = 48;
        break;
      case 'Week':
        firstLineWidth = 24;
        break;
      case 'Month':
        firstLineWidth = 16;
        break;
    }

    const lines: GanttLine[] = [];
    const { dependencies, tasksInfo } = data;
    
    dependencies.forEach(dependency => {
      const taskFrom = tasksInfo.find(task => task.taskID === dependency.fromID);
      const taskTo = tasksInfo.find(task => task.taskID === dependency.toID);

      if (!taskFrom || !taskTo) {
        return;
      }

      if (taskFrom.taskID === taskTo.taskID) {
        return;
      }

      let x1 = taskFrom.offset + taskFrom.width;
      let y1 = taskFrom.marginTop + this.rowHeight / 2;

      const fromFirstLine = {
        x1,
        y1,
        x2: x1 + firstLineWidth,
        y2: y1
      };

      x1 = taskTo.offset - firstLineWidth;
      y1 = taskTo.marginTop + this.rowHeight / 2;

      const toFirstLine = {
        x1,
        y1,
        x2: x1 + firstLineWidth,
        y2: y1,
        hasArrow: true
      };

      x1 = taskTo.offset - firstLineWidth;
      y1 = taskTo.marginTop;

      if (taskFrom.marginTop > taskTo.marginTop) {
        y1 += this.rowHeight;
      }

      const horizontalLine = {
        x1: toFirstLine.x1,
        x2: fromFirstLine.x2,
        y1,
        y2: y1
      };

      const leftVerticalLine = {
        x1: horizontalLine.x1,
        y1: horizontalLine.y1,
        x2: x1,
        y2: toFirstLine.y1
      };

      const rightVerticalLine = {
        x1: fromFirstLine.x2,
        y1: fromFirstLine.y2,
        x2: horizontalLine.x2,
        y2: horizontalLine.y2
      };
    
      lines.push(fromFirstLine);
      lines.push(toFirstLine);
      lines.push(horizontalLine);
      lines.push(leftVerticalLine);
      lines.push(rightVerticalLine);
    });

    return lines;
  }

  public getLineArrowPoints(line: GanttLine): string {
    const width = 6;
    const height = 8;

    let x1 = 0;
    let y1 = -height / 2;

    let x2 = width;
    let y2 = 0;
    
    let x3 = 0;
    let y3 = height / 2;

    x1 += line.x2 - width + 1;
    x2 += line.x2 - width + 1;
    x3 += line.x2 - width + 1;

    y1 += line.y1;
    y2 += line.y1;
    y3 += line.y1;

    return `${x1}, ${y1} ${x2}, ${y2} ${x3}, ${y3}`;
  }

  public searchRow(needRow: GanttTaskRow | null, rows: GanttTaskRow[]): GanttTaskRow | null {
    let result: GanttTaskRow | null = null;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row === needRow) {
        result = row;
        break;
      }

      if (row?.childs) {
        result = this.searchRow(needRow, row.childs);
        if (result === needRow) {
          break;
        }
      }
    }
    
    return result;
  }

  public getVisibleRows(rows: GanttTaskRow[]): GanttTaskRow[] {
    const visibleRows: GanttTaskRow[] = [];
    const allRows = this.getAllRows(rows);

    allRows.forEach(row => {
      if (this.rowIsVisible(row, allRows)) {
        visibleRows.push(row);
      }
    });
    
    return visibleRows;
  }

  public updateTimelineData(tasksRows: GanttTaskRow[], tasksTimelineData: TaskTimelineData[]): TaskTimelineData[] {
    const allRows = this.getAllRows(tasksRows);
    const newData: TaskTimelineData[] = [];

    tasksTimelineData.forEach(data => {
      if (allRows.find(taskRow => taskRow.task.ID === data.taskID)) {
        newData.push(data);
      }
    })

    return newData;
  }

  public getVisibleDependencies(dependencies: GanttTaskDependency[], tasksRows: GanttTaskRow[]): GanttTaskDependency[] {
    const visibleDependencies: GanttTaskDependency[] = [];

    dependencies.forEach(dependency => {
      const rowTaskFrom = tasksRows.find(row => row.task.ID === dependency.fromID);
      const rowTaskTo = tasksRows.find(row => row.task.ID === dependency.toID);

      if (!rowTaskFrom || !rowTaskTo) {
        return;
      }

      visibleDependencies.push(dependency);
    });

    return visibleDependencies;
  }

  public convertDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}-${this.resolve2digits(month)}-${this.resolve2digits(day)}T${this.resolve2digits(hours)}:${this.resolve2digits(minutes)}`;
  }

  public removeTask(task: GanttTask, tasks: GanttTask[], dependencies: GanttTaskDependency[]): GanttTaskRemoveData {
    const newTasks = [...tasks];
    const newDependencies = [...dependencies];

    (function filter(task: GanttTask): void {
      let idx = newTasks.findIndex(currentTask => currentTask.ID === task.ID);
      
      if (idx === -1) {
        return;
      }

      newTasks.splice(idx, 1);

      const toDelete: GanttTaskDependency[] = [];

      dependencies.forEach(dependency => {
        if (dependency.fromID === task.ID || dependency.toID === task.ID) {
          toDelete.push(dependency);
        }
      });

      toDelete.forEach(dependency => {
        const idx = newDependencies.findIndex(currentDependency => currentDependency === dependency);  
  
        if (idx !== -1) {
          newDependencies.splice(idx, 1);
        }
      });

      tasks.forEach(currentTask => {
        if (currentTask.parentID === task.ID) {
          filter(currentTask);
        }
      });
    })(task);

    return { newTasks, newDependencies };
  }

  public getTaskPossibleParents(task: GanttTask, tasks: GanttTask[]): GanttTask[] {
    const possibleParents: GanttTask[] = [];
    const taskChilds: GanttTask[] = [];

    (function getTaskChilds(task: GanttTask): void {
      tasks.forEach(currentTask => {
        if (currentTask.parentID === task.ID) {
          taskChilds.push(currentTask);
          getTaskChilds(currentTask);
        }
      });
    })(task);

    tasks.forEach(currentTask => {
      if (currentTask.ID === task.ID || taskChilds.find(task => task.ID === currentTask.ID)) {
        return;
      }

      possibleParents.push(currentTask);
    })

    return possibleParents;
  }
  
  private weekStart(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1))
    return newDate;
  }

  private getDateLimits(tasks: GanttTask[]): { minDate: Date, maxDate: Date } {
    const dates = [
      ...tasks.map(task => Number(task.startDate)),
      ...tasks.map(task => Number(task.endDate))
    ];

    return {
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates))
    };
  }

  private datesDifferent(first: Date, second: Date, period: GanttPeriod): number {
    const diff = Math.abs(first.getTime() - second.getTime());
    let result: number;

    switch (period) {
      case 'Day':
        result = diff / (24 * 3600 * 1000);
        break;
      case 'Week':
        result = diff / (7 * 24 * 3600 * 1000);
        break;
      case 'Month':
        result = (second.getMonth() + 12 * second.getFullYear()) - (first.getMonth() + 12 * first.getFullYear());
        break;
    }

    return parseInt(result.toString());
  }

  private partsForDay(different: number, date: Date, periodParts: PeriodPart[]): void {
    for (let i = 0; i <= different + 1; i++) {
      const mainDate = this.minimizeDate(date);
      mainDate.setDate(mainDate.getDate() + i);

      const detailDates: Date[] = [];

      for (let j = 0; j <= 23; j++) {
        const detailDate = new Date(mainDate);
        detailDate.setHours(j);
        detailDates.push(detailDate);
      }

      const periodPart: PeriodPart = {
        main: mainDate,
        detail: detailDates
      };

      periodParts.push(periodPart);
    }
  }

  private partsForWeek(different: number, date: Date, periodParts: PeriodPart[]): void {
    for (let i = 0; i <= different; i++) {
      const mainDate = this.weekStart(this.minimizeDate(date));
      mainDate.setDate(mainDate.getDate() + 7 * i);

      const detailDates: Date[] = [];

      for (let j = 0; j <= 6; j++) {
        const detailDate = new Date(mainDate);
        detailDate.setDate(detailDate.getDate() + j);
        detailDates.push(detailDate);
      }

      const periodPart: PeriodPart = {
        main: mainDate,
        detail: detailDates
      };

      periodParts.push(periodPart);
    }
  }

  private partsForMonth(different: number, date: Date, periodParts: PeriodPart[]): void {
    const startDate = this.minimizeDate(date);
    startDate.setDate(1);

    for (let i = 0; i <= different; i++) {
      const mainDate = new Date(startDate);
      mainDate.setMonth(mainDate.getMonth() + i);

      const detailDates: Date[] = [];

      for (let j = 0; j < 5; j++) {
        const detailDate = new Date(mainDate);
        detailDate.setDate(detailDate.getDate() + 7 * j);
        detailDates.push(detailDate);
      }

      const periodPart: PeriodPart = {
        main: mainDate,
        detail: detailDates
      };

      periodParts.push(periodPart);
    }
  }

  private getDifferentHours(first: Date, second: Date): number {
    return Math.abs(first.getTime() - second.getTime()) / (3600 * 1000);
  }

  private getDifferentDays(first: Date, second: Date): number {
    return Math.abs(first.getTime() - second.getTime()) / (24 * 3600 * 1000);
  }

  private getDifferentWeeks(first: Date, second: Date): number {
    const result = Math.abs(first.getTime() - second.getTime()) / (7 * 24 * 3600 * 1000)
    return result;
  }

  private minimizeDate(date: Date): Date {
    const newDate = new Date(date);

    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate;
  }

  private getAllRows(rows: GanttTaskRow[]): GanttTaskRow[] {
    const allRows: GanttTaskRow[] = [];

    (function openRows(rows: GanttTaskRow[]) {
      rows.forEach(row => {
        allRows.push(row);

        if (row.childs) {
          openRows(row.childs);
        }
      })
    })(rows);

    return allRows;
  }

  private rowIsVisible(row: GanttTaskRow, rows: GanttTaskRow[]): boolean {
    let isVisible = true;

    (function parentIsOpened(row: GanttTaskRow) {
      if (row.task.parentID === undefined || row.task.parentID === null) {
        return;
      }

      const parentRow = rows.find(currentRow => currentRow.task.ID === row.task.parentID);

      if (!parentRow) {
        return;
      }

      if (!parentRow.opened) {
        isVisible = false;
        return;
      }
      
      parentIsOpened(parentRow);
    })(row);

    return isVisible;
  }

  private resolve2digits(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}