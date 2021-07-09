import { Injectable } from '@angular/core';
import { GanttPeriod, GanttTask } from '../../interfaces';

@Injectable({providedIn: 'root'})
export class GanttService {
  public calculatePeriodParts(period: GanttPeriod, tasks: GanttTask[]): Date[] {
    const { minDate, maxDate } = this.getDateLimits(tasks);

    const periodParts: Date[] = [];
    const different = this.datesDifferent(minDate, maxDate, period);

    switch (period) {
      case 'Day':
      case 'Week':
        for (let i = 0; i <= different; i++) {
          const date = new Date(minDate);
          const mul = (period === 'Day') ? 1 : 7;

          date.setDate(date.getDate() + mul * i)
          periodParts.push(date);
        }
        break;
      case 'Month':
        for (let i = 0; i <= different; i++) {
          const date = new Date(minDate);
          date.setMonth(date.getMonth() + i)
          periodParts.push(date);
        }
        break;
    }

    return periodParts;
  }

  public weekEnd(date: Date): Date {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);
    return endDate;
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
        const firstYear = first.getFullYear();
        const firstMonth = first.getMonth();

        const secondYear = second.getFullYear();
        const secondMonth = second.getMonth();

        result = (secondMonth + 12 * secondYear) - (firstMonth + 12 * firstYear);
        break;
    }

    const different = parseInt(result.toString());
    console.log(`date different (${period}):`, different);
    
    return different;
  }
}