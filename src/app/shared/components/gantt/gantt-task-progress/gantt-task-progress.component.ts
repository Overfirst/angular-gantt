import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'gantt-task-progress',
  templateUrl: './gantt-task-progress.component.html',
  styleUrls: ['./gantt-task-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttTaskProgressComponent {
  @Input() public progress = 0;
  @Input() public offset = 0;
}
