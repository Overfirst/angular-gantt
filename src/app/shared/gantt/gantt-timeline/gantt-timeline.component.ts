import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GanttTask } from '../../interfaces';

@Component({
  selector: 'app-gantt-timeline',
  templateUrl: './gantt-timeline.component.html',
  styleUrls: ['./gantt-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTimelineComponent {
  @Input() public tasks: GanttTask[] = [];
}
