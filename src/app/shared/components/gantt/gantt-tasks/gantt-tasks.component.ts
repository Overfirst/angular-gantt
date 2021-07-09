import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttTask } from '../../../interfaces';

@Component({
  selector: 'gantt-tasks',
  templateUrl: './gantt-tasks.component.html',
  styleUrls: ['./gantt-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTasksComponent {
  @Input() public tasks: GanttTask[] = [];
}
