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
    
    this.offset = this.service.computeTaskProgressOffset(data.task, data.period, data.periodParts)
    this.width = this.service.computeTaskProgressWidth(data.task, data.period, data.periodParts);
  }

  constructor(private service: GanttService) {}

  public get color(): string {
    return this.data.task.color || GanttTaskProgressComponent.defaultColor;
  }
}
