import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttPeriod, GanttTask, TaskProgressInput } from 'src/app/shared/interfaces';
import { GanttService } from '../gantt.service';

@Component({
  selector: 'gantt-task-progress',
  templateUrl: './gantt-task-progress.component.html',
  styleUrls: ['./gantt-task-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTaskProgressComponent {
  constructor(private service: GanttService) {}

  private _data: TaskProgressInput;

  @Input() public set data(data: TaskProgressInput) {
    this._data = data;
    this.progress = this.data.task.readyPercent;
    
    this.offset = this.service.computeTaskProgressOffset(data.task, data.period, data.periodParts)
    this.width = this.service.computeTaskProgressWidth(data.task, data.period, data.periodParts);
  }

  public get data() {
    return this._data;
  }

  public progress = 0;
  public offset = 0;
  public width = 0;
}
