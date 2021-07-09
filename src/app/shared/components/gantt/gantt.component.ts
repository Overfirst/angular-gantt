import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttPeriod, GanttTask } from '../../interfaces';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttComponent {
  @Input() public tasks: GanttTask[] = [];
  public period: GanttPeriod;

  public periodChange(period: GanttPeriod): void {
    this.period = period;
  }
}
