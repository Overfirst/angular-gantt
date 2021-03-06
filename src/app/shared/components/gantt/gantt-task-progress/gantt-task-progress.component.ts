import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TaskProgressInput, TaskTimelineData } from 'src/app/shared/interfaces';
import { GanttService } from '../../../services/gantt.service';

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
    const task = this.data.task;

    this.progress = task.readyPercent;
    this.offset = this.service.computeDateOffset(task.startDate, data.period, data.minDate)
    this.width = this.service.computeTaskProgressWidth(task, data.period);

    this.dataChanged.emit({
      taskID: task.ID,
      offset: this.offset,
      width: this.width,
      marginTop: data.marginTop
    });
  }

  @Output() public dataChanged = new EventEmitter<TaskTimelineData>();

  constructor(
    private service: GanttService,
    private datePipe: DatePipe
  ) {}

  public get color(): string {
    if (!this.data.task.color) {
      this.data.task.color = GanttTaskProgressComponent.defaultColor;
    }

    return this.data.task.color;
  }

  public get title(): string {
    const convert = (date: Date) => this.datePipe.transform(date, 'dd.MM.YYYY, HH:mm');
    const task = this.data.task;

    return 'Task: ' + task.name + '\n' +
           'Start date: ' + convert(task.startDate) + '\n' +
           'End date: ' + convert(task.endDate) + '\n' +
           'Progress: ' + task.readyPercent + '%';
  }

  public get height() {
    return this.service.taskProgressHeight;
  }
}
