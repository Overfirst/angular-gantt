import { Injectable } from '@angular/core';
import { GanttPeriod, GanttTask, PeriodPart } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class GanttService {
  private weekStart(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1))
    return newDate;
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
    for (let i = 0; i <= different; i++) {
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

  private getDifferentHours(first: Date, second: Date): number {
    return Math.abs(first.getTime() - second.getTime()) / (3600 * 1000);
  }

  private getDifferentDays(first: Date, second: Date): number {
    return Math.abs(first.getTime() - second.getTime()) / (24 * 3600 * 1000);
  }

  private getDifferentWeeks(first: Date, second: Date): number {
    const result = Math.abs(first.getTime() - second.getTime()) / (7 * 24 * 3600 * 1000)
    console.log('getDifferentWeeks:', result);

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
}