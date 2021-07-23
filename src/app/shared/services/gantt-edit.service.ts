import { Injectable } from "@angular/core";
import { GanttTask, TimePoint } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class GanttEditService {
  public createTimePoints(): TimePoint[] {
    const timePoints: TimePoint[] = [];

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        
        const hours = i;
        const minutes = j % 2 === 0 ? 0 : 30;

        const timePoint = {
          hours: hours < 10 ? `0${hours}` : `${hours}`,
          minutes: minutes < 10 ? `0${minutes}` : `${minutes}`
        }

        timePoints.push(timePoint);
      }
    }

    return timePoints;
  }

  public getStringTimePointFromDate(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours < 10 ? '0': ''}${hours}:${minutes < 10 ? '0': ''}${minutes}`;
  }

  public getEditedTaskFromFormData(data: any, editableTask: GanttTask): GanttTask {
    const task = {...editableTask};

    task.name = data.name;
    task.readyPercent = data.readyPercent;

    task.startDate = new Date(data.startDate);
   
    const startDateTimePoint = this.getTimePointFromString(data.startDateTimePoint);
    task.startDate.setHours(+startDateTimePoint.hours);
    task.startDate.setMinutes(+startDateTimePoint.minutes);

    task.endDate = new Date(data.endDate);

    const endDateTimePoint = this.getTimePointFromString(data.endDateTimePoint);
    task.endDate.setHours(+endDateTimePoint.hours);
    task.endDate.setMinutes(+endDateTimePoint.minutes);

    return task;
  }

  public getTimePointFromString(timePoint: string): TimePoint {
    return {
      hours: timePoint.substr(0, 2),
      minutes: timePoint.substr(3, 4)
    };
  }

  public convertDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }
}