import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TaskProgressInput } from 'src/app/shared/interfaces';
import { GanttService } from '../gantt.service';

@Component({
  selector: 'gantt-task-progress',
  templateUrl: './gantt-task-progress.component.html',
  styleUrls: ['./gantt-task-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTaskProgressComponent {
  static defaultColor: string = '#ff6358';

  private _data: TaskProgressInput;

  public progress = 0;
  public offset = 0;
  public width = 0;

  public get data() {
    return this._data;
  }

  @Input() public set data(data: TaskProgressInput) {
    this._data = data;
    this.progress = this.data.task.readyPercent;
    
    this.offset = this.service.computeDateOffset(data.task.startDate, data.period, data.minDate)
    this.width = this.service.computeTaskProgressWidth(data.task, data.period);
  }

  constructor(
    private service: GanttService,
    private datePipe: DatePipe  
  ) {}

  public get color(): string {
    return this.data.task.color || GanttTaskProgressComponent.defaultColor;
  }

  public get title(): string {
    const convert = (date: Date) => this.datePipe.transform(date, 'dd.MM.YYYY, HH:mm');

    return 'Task: ' + this.data.task.name + '\n' +
           'Start date: ' + convert(this.data.task.startDate) + '\n' +
           'End date: ' + convert(this.data.task.endDate) + '\n' +
           'Progress: ' + this.data.task.readyPercent + '%';
  }
}
