import { Injectable } from '@angular/core';
import { GanttPeriod } from '../../interfaces';

@Injectable({providedIn: 'root'})
export class GanttService {
  public calculatePeriodParts(period: GanttPeriod): any[] {
    const periodParts = [];

    switch (period) {
      case 'Day':
        for (let i = 0; i <= 23; i++) {
          periodParts.push(i)
        }
        break;
      case 'Week':
        for (let i = 1; i <= 7; i++) {
          periodParts.push(i)
        }
        break;
      case 'Month':
        for (let i = 1; i <= 30; i++) {
          periodParts.push(i)
        }
        break;
    }

    return periodParts;
  }
}